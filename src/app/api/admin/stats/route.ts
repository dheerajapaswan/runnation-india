import { ok, handle, requireSession } from "@/server/http";
import { getStats } from "@/server/services";

export async function GET() {
  return handle(async () => {
    await requireSession("admin");
    return ok(await getStats());
  });
}
