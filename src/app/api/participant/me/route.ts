import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

/** Lightweight "who am I" for the navbar. Always 200; data is null when signed out. */
export async function GET() {
  return handle(async () => {
    const id = await getSession("participant");
    const reg = id ? await db.registration.findUnique({ where: { id }, select: { fullName: true } }) : null;
    return NextResponse.json(
      { success: true, data: reg ? { name: reg.fullName } : null },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
