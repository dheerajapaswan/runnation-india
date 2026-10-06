import { ok, handle, readJson, requireSession } from "@/server/http";
import { parseId, registrationUpdateSchema } from "@/server/validation";
import { updateRegistration } from "@/server/services";
import { toParticipant } from "@/server/mappers";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireSession("admin");
    const id = parseId((await ctx.params).id);
    const patch = registrationUpdateSchema.parse(await readJson(req));
    return ok(toParticipant(await updateRegistration(id, patch)));
  });
}
