import { ok, handle, readJson } from "@/server/http";
import { registrationSchema } from "@/server/validation";
import { createRegistration } from "@/server/services";
import { startSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  return handle(async () => {
    const input = registrationSchema.parse(await readJson(req));
    const reg = await createRegistration(input);
    await startSession("participant", reg.id);
    return ok({ code: reg.code, amountInr: reg.amountInr, paymentStatus: "pending" }, 201);
  });
}
