import { ok, handle } from "@/server/http";
import { endSession } from "@/lib/auth/session";

export async function POST() {
  return handle(async () => {
    await endSession("participant");
    return ok({ loggedIn: false });
  });
}
