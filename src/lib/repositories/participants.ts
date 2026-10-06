import "server-only";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { toParticipant } from "@/server/mappers";
import type { Participant } from "@/types";

export async function listParticipants(): Promise<Participant[]> {
  const rows = await db.registration.findMany({ include: { proof: true }, orderBy: { createdAt: "desc" } });
  return rows.map(toParticipant);
}

/** The logged-in participant, or null. */
export async function getCurrentParticipant(): Promise<Participant | null> {
  const id = await getSession("participant");
  if (!id) return null;
  const row = await db.registration.findUnique({ where: { id }, include: { proof: true } });
  return row ? toParticipant(row) : null;
}
