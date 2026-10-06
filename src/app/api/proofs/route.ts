import { HttpError, ok, handle, requireSession } from "@/server/http";
import { PROOF_MAX_BYTES, PROOF_TYPES, proofSubmitSchema } from "@/server/validation";
import { applyAnalysis, submitProof } from "@/server/services";
import { analyzeProof, summarize } from "@/server/proof-analysis";
import { db } from "@/lib/db";
import { getDistance } from "@/data/distances";
import { DISTANCE_FROM_DB, timeToSeconds } from "@/server/mappers";

export const maxDuration = 60;

export async function POST(req: Request) {
  return handle(async () => {
    const registrationId = await requireSession("participant");
    const form = await req.formData().catch(() => {
      throw new HttpError(400, "Invalid request body");
    });
    const input = proofSubmitSchema.parse({ app: form.get("app"), time: form.get("time"), date: form.get("date") });
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) throw new HttpError(400, "Validation failed", { file: "Attach a screenshot or export of your run." });
    if (!PROOF_TYPES.includes(file.type)) throw new HttpError(400, "Validation failed", { file: "Use a PNG, JPG, WebP or PDF file." });
    if (file.size > PROOF_MAX_BYTES) throw new HttpError(400, "Validation failed", { file: "File must be under 5 MB." });

    const proof = await submitProof(registrationId, input, { name: file.name, type: file.type, size: file.size });

    // Analyse the file in memory (it is not stored), then record the verdict.
    const reg = await db.registration.findUniqueOrThrow({ where: { id: registrationId }, select: { distance: true } });
    const analysis = await analyzeProof(file, {
      requiredKm: getDistance(DISTANCE_FROM_DB[reg.distance]).kilometres,
      finishSeconds: timeToSeconds(input.time),
      runDate: input.date,
    });
    const status = await applyAnalysis(proof.id, analysis);
    console.info("[proof]", proof.id, summarize(analysis));

    return ok({ id: proof.id, status, verdict: analysis.status, reasons: analysis.status === "matched" ? [] : analysis.reasons }, 201);
  });
}
