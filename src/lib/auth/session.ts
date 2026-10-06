import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Role = "admin" | "participant";

const COOKIE: Record<Role, string> = { admin: "rv_admin", participant: "rv_participant" };
const MAX_AGE: Record<Role, number> = { admin: 60 * 60 * 8, participant: 60 * 60 * 24 * 30 };

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET is not configured");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

/** Token = base64url(JSON{role,sub,exp}).signature */
function makeToken(role: Role, sub: string): string {
  const body = Buffer.from(JSON.stringify({ role, sub, exp: Date.now() + MAX_AGE[role] * 1000 })).toString("base64url");
  return `${body}.${sign(body)}`;
}

function readToken(token: string | undefined, role: Role): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as { role: Role; sub: string; exp: number };
    return data.role === role && data.exp > Date.now() ? data.sub : null;
  } catch {
    return null;
  }
}

export async function startSession(role: Role, sub: string): Promise<void> {
  (await cookies()).set(COOKIE[role], makeToken(role, sub), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE[role],
  });
}

export async function endSession(role: Role): Promise<void> {
  (await cookies()).delete(COOKIE[role]);
}

/** Returns the subject (admin: "admin", participant: registration id) or null. */
export async function getSession(role: Role): Promise<string | null> {
  return readToken((await cookies()).get(COOKIE[role])?.value, role);
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHmac("sha256", "cmp").update(input).digest();
  const b = createHmac("sha256", "cmp").update(expected).digest();
  return timingSafeEqual(a, b);
}
