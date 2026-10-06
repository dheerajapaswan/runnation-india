import "server-only";
import { randomInt } from "node:crypto";
import { Prisma } from "@prisma/client";
import type { z } from "zod";
import { db } from "@/lib/db";
import { UPCOMING_EVENT } from "@/data/event";
import { getPricing } from "@/data/distances";
import { HttpError } from "./http";
import type { Analysis } from "./proof-analysis";
import { DISTANCE_TO_DB, timeToSeconds } from "./mappers";
import type { proofSubmitSchema, registrationSchema } from "./validation";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () => "RV26-" + Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");

export function ensureEvent() {
  return db.event.upsert({
    where: { slug: UPCOMING_EVENT.slug },
    update: {},
    create: { slug: UPCOMING_EVENT.slug, name: UPCOMING_EVENT.name },
  });
}

export async function createRegistration(input: z.infer<typeof registrationSchema>) {
  const event = await ensureEvent();
  const exists = await db.registration.findUnique({
    where: { eventId_email: { eventId: event.id, email: input.email } },
    select: { id: true },
  });
  if (exists) throw new HttpError(409, "This email is already registered for the event.");

  // Price comes from server config, never from the client.
  const amountInr = getPricing(input.distanceId).amountInr;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await db.registration.create({
        data: {
          code: newCode(),
          eventId: event.id,
          fullName: input.fullName,
          email: input.email,
          mobile: input.mobile,
          dateOfBirth: new Date(input.dateOfBirth),
          gender: input.gender,
          distance: DISTANCE_TO_DB[input.distanceId],
          amountInr,
          address: input.address,
          city: input.city,
          pincode: input.pincode,
        },
      });
    } catch (e) {
      const target = e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" ? String(e.meta?.target ?? "") : null;
      if (target === null) throw e;
      if (target.includes("email")) throw new HttpError(409, "This email is already registered for the event.");
      // otherwise a code collision: retry with a new code
    }
  }
  throw new HttpError(500, "Could not generate a registration ID");
}

export async function submitProof(
  registrationId: string,
  input: z.infer<typeof proofSubmitSchema>,
  file: { name: string; type: string; size: number },
) {
  const reg = await db.registration.findUnique({ where: { id: registrationId }, include: { proof: true } });
  if (!reg) throw new HttpError(404, "Registration not found");
  if (reg.paymentStatus !== "PAID") throw new HttpError(403, "Payment must be confirmed before you can submit proof.");
  if (reg.proof?.status === "APPROVED") throw new HttpError(409, "Your proof has already been approved.");

  const finishSeconds = timeToSeconds(input.time);
  if (finishSeconds <= 0) throw new HttpError(400, "Validation failed", { time: "Enter a valid finish time." });

  const data = {
    app: input.app,
    finishSeconds,
    runDate: new Date(input.date),
    fileName: file.name.slice(0, 200),
    fileType: file.type,
    fileSize: file.size,
    status: "SUBMITTED" as const,
    analysis: Prisma.DbNull,
    autoApproved: false,
    reviewedAt: null,
  };
  return db.runProof.upsert({ where: { registrationId }, create: { registrationId, ...data }, update: data });
}

export async function applyAnalysis(proofId: string, analysis: Analysis) {
  await db.runProof.update({ where: { id: proofId }, data: { analysis: analysis as unknown as Prisma.InputJsonValue } });
  // Auto-approval is opt-in and only for a clean deterministic match.
  if (analysis.status === "matched" && process.env.PROOF_AUTO_APPROVE === "true") {
    await reviewProof(proofId, "approved");
    await db.runProof.update({ where: { id: proofId }, data: { autoApproved: true } });
    return "approved" as const;
  }
  return "submitted" as const;
}

export async function reviewProof(proofId: string, decision: "approved" | "rejected") {
  return db.$transaction(async (tx) => {
    const proof = await tx.runProof.findUniqueOrThrow({ where: { id: proofId }, include: { registration: true } });
    const reg = proof.registration;

    if (decision === "approved") {
      await tx.registration.update({
        where: { id: reg.id },
        data: { certificateIssued: true },
      });
      return tx.runProof.update({ where: { id: proofId }, data: { status: "APPROVED", reviewedAt: new Date() } });
    }

    if (reg.medalStatus !== "NOT_READY") {
      throw new HttpError(409, "Medal already packed; this proof can no longer be rejected.");
    }
    await tx.registration.update({ where: { id: reg.id }, data: { certificateIssued: false } });
    return tx.runProof.update({ where: { id: proofId }, data: { status: "REJECTED", reviewedAt: new Date() } });
  });
}

const MEDAL_NEXT: Record<string, string> = { NOT_READY: "PACKED", PACKED: "SHIPPED", SHIPPED: "DELIVERED" };

export async function updateRegistration(
  id: string,
  patch: { paymentStatus?: "pending" | "paid" | "failed" | "refunded"; medalStatus?: "packed" | "shipped" | "delivered" },
) {
  const reg = await db.registration.findUniqueOrThrow({ where: { id }, include: { proof: true } });
  if (patch.medalStatus) {
    if (reg.proof?.status !== "APPROVED") throw new HttpError(409, "Medal status can only change after the proof is approved.");
    const wanted = patch.medalStatus.toUpperCase();
    if (MEDAL_NEXT[reg.medalStatus] !== wanted) {
      throw new HttpError(409, `Medal status must move step by step (currently ${reg.medalStatus.toLowerCase().replace("_", " ")}).`);
    }
  }
  return db.registration.update({
    where: { id },
    data: {
      ...(patch.paymentStatus && { paymentStatus: patch.paymentStatus.toUpperCase() as "PENDING" | "PAID" | "FAILED" | "REFUNDED" }),
      ...(patch.medalStatus && { medalStatus: patch.medalStatus.toUpperCase() as "PACKED" | "SHIPPED" | "DELIVERED" }),
    },
    include: { proof: true },
  });
}

export async function getStats() {
  const [registrations, paid, revenue, proofsToReview, medalsToPack] = await Promise.all([
    db.registration.count(),
    db.registration.count({ where: { paymentStatus: "PAID" } }),
    db.registration.aggregate({ where: { paymentStatus: "PAID" }, _sum: { amountInr: true } }),
    db.runProof.count({ where: { status: "SUBMITTED" } }),
    db.registration.count({ where: { medalStatus: "NOT_READY", proof: { is: { status: "APPROVED" } } } }),
  ]);
  return { registrations, paid, revenueInr: revenue._sum.amountInr ?? 0, proofsToReview, medalsToPack };
}
