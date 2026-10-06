import "server-only";
import { db } from "@/lib/db";
import { toResult } from "@/server/mappers";
import type { Distance } from "@prisma/client";
import type { DistanceId, Result } from "@/types";

const ORDER: Distance[] = ["D3K", "D5K", "D10K", "D21K"];

/**
 * Public Finisher Wall: approved proofs only, grouped by distance (shortest first)
 * and ranked by finish time within each distance. Ties go to the earlier submission.
 * `perDistance` limits how many top finishers per distance are returned.
 */
export async function listResults(options?: { perDistance?: number }): Promise<Result[]> {
  try {
    const rows = await db.registration.findMany({
      where: { proof: { is: { status: "APPROVED" } } },
      include: { proof: true },
    });
    const sorted = rows
      .flatMap((r) => (r.proof ? [{ ...r, proof: r.proof }] : []))
      .sort(
        (a, b) =>
          ORDER.indexOf(a.distance) - ORDER.indexOf(b.distance) ||
          a.proof.finishSeconds - b.proof.finishSeconds ||
          a.proof.createdAt.getTime() - b.proof.createdAt.getTime(),
      );

    const counts = new Map<DistanceId | string, number>();
    const out: Result[] = [];
    for (const r of sorted) {
      const rank = (counts.get(r.distance) ?? 0) + 1;
      counts.set(r.distance, rank);
      if (options?.perDistance && rank > options.perDistance) continue;
      out.push(toResult(r, rank));
    }
    return out;
  } catch (e) {
    // Keep public pages up if the database is unreachable.
    console.error("[results] query failed:", e instanceof Error ? e.name : "unknown");
    return [];
  }
}
