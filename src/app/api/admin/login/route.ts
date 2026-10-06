import { HttpError, ok, handle, readJson } from "@/server/http";
import { adminLoginSchema } from "@/server/validation";
import { passwordMatches, startSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  return handle(async () => {
    const { password } = adminLoginSchema.parse(await readJson(req));
    if (!passwordMatches(password)) throw new HttpError(401, "Incorrect password.");
    await startSession("admin", "admin");
    return ok({ loggedIn: true });
  });
}
