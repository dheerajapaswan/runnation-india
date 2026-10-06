import { ok, handle, requireSession } from "@/server/http";
import { listParticipants } from "@/lib/repositories/participants";

export async function GET() {
  return handle(async () => {
    await requireSession("admin");
    return ok(await listParticipants());
  });
}
