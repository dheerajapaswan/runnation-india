import { HttpError, ok, handle, readJson } from "@/server/http";
import { participantLoginSchema } from "@/server/validation";
import { startSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  return handle(async () => {
    const { code, email } = participantLoginSchema.parse(await readJson(req));
    const reg = await db.registration.findUnique({ where: { code }, select: { id: true, email: true } });
    // Same message for unknown code and wrong email: do not reveal which was wrong.
    if (!reg || reg.email !== email) throw new HttpError(401, "Registration ID and email do not match.");
    await startSession("participant", reg.id);
    return ok({ loggedIn: true });
  });
}
