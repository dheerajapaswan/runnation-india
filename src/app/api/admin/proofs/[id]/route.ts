import { ok, handle, readJson, requireSession } from "@/server/http";
import { parseId, proofReviewSchema } from "@/server/validation";
import { reviewProof } from "@/server/services";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireSession("admin");
    const id = parseId((await ctx.params).id);
    const { status } = proofReviewSchema.parse(await readJson(req));
    const proof = await reviewProof(id, status);
    return ok({ id: proof.id, status });
  });
}
