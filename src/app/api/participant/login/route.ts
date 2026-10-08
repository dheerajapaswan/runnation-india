import { HttpError, ok, handle, readJson } from "@/server/http";
import { participantLoginSchema } from "@/server/validation";
import { startSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { clientIp, enforce, participantCodeRule, participantIpRule, resetLimits } from "@/server/rate-limit";

export async function POST(req: Request) {
  return handle(async () => {
    const ip = clientIp(req);
    await enforce([participantIpRule(ip)]);
    const { code, email } = participantLoginSchema.parse(await readJson(req));
    const codeRule = participantCodeRule(code);
    await enforce([codeRule]);

    const reg = await db.registration.findUnique({ where: { code }, select: { id: true, email: true } });
    // Same message for unknown code and wrong email: do not reveal which was wrong.
    if (!reg || reg.email !== email) throw new HttpError(401, "Registration ID and email do not match.");
    await resetLimits(codeRule.key, participantIpRule(ip).key);
    await startSession("participant", reg.id);
    return ok({ loggedIn: true });
  });
}
