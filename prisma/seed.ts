import { PrismaClient } from "@prisma/client";
import { PARTICIPANTS } from "../src/data/participants";
import { UPCOMING_EVENT } from "../src/data/event";

const db = new PrismaClient();
const DIST = { "3k": "D3K", "5k": "D5K", "10k": "D10K", "21k": "D21K" } as const;
const secs = (t: string) => t.split(":").reduce((a, p) => a * 60 + Number(p), 0);

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed in production");
  const event = await db.event.upsert({
    where: { slug: UPCOMING_EVENT.slug },
    update: {},
    create: { slug: UPCOMING_EVENT.slug, name: UPCOMING_EVENT.name },
  });

  for (const p of PARTICIPANTS) {
    const reg = await db.registration.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        eventId: event.id,
        fullName: p.name,
        email: p.email,
        mobile: "9" + p.mobile.slice(-9),
        dateOfBirth: new Date("1992-04-15"),
        gender: "Prefer not to say",
        distance: DIST[p.distanceId],
        amountInr: p.amountInr,
        address: `${p.city} (sample address for development)`,
        city: p.city,
        pincode: "800001",
        paymentStatus: p.paymentStatus.toUpperCase() as "PENDING" | "PAID" | "FAILED" | "REFUNDED",
        medalStatus: p.medalStatus.toUpperCase() as "NOT_READY" | "PACKED" | "SHIPPED" | "DELIVERED",
        certificateIssued: p.certificateIssued,
      },
    });
    if (p.finishTime && p.runDate && p.proofApp && p.proofStatus !== "not_submitted") {
      await db.runProof.upsert({
        where: { registrationId: reg.id },
        update: {},
        create: {
          registrationId: reg.id,
          app: p.proofApp,
          finishSeconds: secs(p.finishTime),
          runDate: new Date(p.runDate),
          fileName: "sample-proof.png",
          fileType: "image/png",
          fileSize: 120000,
          status: p.proofStatus.toUpperCase() as "SUBMITTED" | "APPROVED" | "REJECTED",
        },
      });
    }
  }
  console.log(`Seeded ${PARTICIPANTS.length} sample registrations.`);
}

main().finally(() => db.$disconnect());
