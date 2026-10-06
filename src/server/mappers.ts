import type { Distance, MedalStatus, PaymentStatus, ProofStatus, Registration, RunProof } from "@prisma/client";
import type { DistanceId, Participant, Result } from "@/types";
import { summarize, type Analysis } from "./proof-analysis";

export const DISTANCE_TO_DB: Record<DistanceId, Distance> = { "3k": "D3K", "5k": "D5K", "10k": "D10K", "21k": "D21K" };
export const DISTANCE_FROM_DB: Record<Distance, DistanceId> = { D3K: "3k", D5K: "5k", D10K: "10k", D21K: "21k" };

export function secondsToTime(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function timeToSeconds(t: string): number {
  return t.trim().split(":").reduce((acc, p) => acc * 60 + Number(p), 0);
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const lower = <T extends string>(s: T) => s.toLowerCase() as Lowercase<T>;

export function toParticipant(r: Registration & { proof: RunProof | null }): Participant {
  return {
    id: r.id,
    code: r.code,
    name: r.fullName,
    email: r.email,
    mobile: r.mobile,
    city: r.city,
    distanceId: DISTANCE_FROM_DB[r.distance],
    amountInr: r.amountInr,
    paymentStatus: lower<PaymentStatus>(r.paymentStatus) as Participant["paymentStatus"],
    proofStatus: r.proof ? (lower<ProofStatus>(r.proof.status) as Participant["proofStatus"]) : "not_submitted",
    proofId: r.proof?.id,
    analysisNote: r.proof?.analysis ? summarize(r.proof.analysis as unknown as Analysis) : undefined,
    finishTime: r.proof ? secondsToTime(r.proof.finishSeconds) : undefined,
    runDate: r.proof ? iso(r.proof.runDate) : undefined,
    proofApp: r.proof?.app,
    certificateIssued: r.certificateIssued,
    bibNumber: r.bibNumber,
    medalStatus: lower<MedalStatus>(r.medalStatus) as Participant["medalStatus"],
    registeredAt: iso(r.createdAt),
  };
}

export function toResult(r: Registration & { proof: RunProof }, rank: number): Result {
  return {
    id: r.proof.id,
    runner: { id: r.id, name: r.fullName, city: r.city },
    distanceId: DISTANCE_FROM_DB[r.distance],
    finishTime: secondsToTime(r.proof.finishSeconds),
    date: iso(r.proof.runDate),
    status: "finisher",
    rank,
  };
}
