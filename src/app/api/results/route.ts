import { ok, handle } from "@/server/http";
import { listResults } from "@/lib/repositories/results";

export async function GET() {
  return handle(async () => ok(await listResults()));
}
