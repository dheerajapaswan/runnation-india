import { HttpError, ok, handle, readJson } from "@/server/http";
import { adminLoginSchema } from "@/server/validation";
import { passwordMatches, startSession } from "@/lib/auth/session";
import { adminLoginRules, clientIp, enforce, resetLimits } from "@/server/rate-limit";

export async function POST(req: Request) {
  return handle(async () => {
    const ip = clientIp(req);
    await enforce(adminLoginRules(ip));
    const { password } = adminLoginSchema.parse(await readJson(req));
    if (!passwordMatches(password)) throw new HttpError(401, "Incorrect password.");
    await resetLimits(`admin:ip:${ip}`);
    await startSession("admin", "admin");
    return ok({ loggedIn: true });
  });
}
