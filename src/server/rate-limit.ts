import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { HttpError } from "./http";

/**
 * Fixed-window rate limiting stored in Postgres, so it works across serverless instances.
 * Each call counts one attempt; the window starts at the first attempt and resets itself.
 */
async function hit(key: string, limit: number, windowSec: number): Promise<{ blocked: boolean; retryAfter: number }> {
  try {
    const rows = await db.$queryRaw<{ count: number; retry: number }[]>(Prisma.sql`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (${key}, 1, now() + make_interval(secs => ${windowSec}::int))
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."resetAt" <= now() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= now() THEN now() + make_interval(secs => ${windowSec}::int) ELSE "RateLimit"."resetAt" END
      RETURNING "count", GREATEST(1, CEIL(EXTRACT(EPOCH FROM ("resetAt" - now()))))::int AS "retry"
    `);
    const row = rows[0];
    // Opportunistic cleanup of long-expired rows.
    if (Math.random() < 0.02) {
      void db.$executeRaw`DELETE FROM "RateLimit" WHERE "resetAt" < now() - interval '1 day'`.catch(() => undefined);
    }
    return { blocked: row.count > limit, retryAfter: row.retry };
  } catch (e) {
    // Availability over lock-out: if the limiter store is unreachable, log and let the request through.
    console.error("[rate-limit] store error:", e instanceof Error ? e.name : "unknown");
    return { blocked: false, retryAfter: 0 };
  }
}

export async function resetLimits(...keys: string[]): Promise<void> {
  try {
    await db.rateLimit.deleteMany({ where: { key: { in: keys } } });
  } catch {
    // best effort
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "unknown";
}

export interface Rule {
  key: string;
  limit: number;
  windowSec: number;
}

/** Counts an attempt against every rule and throws 429 if any is exceeded. */
export async function enforce(rules: Rule[]): Promise<void> {
  let worst = 0;
  for (const r of rules) {
    const { blocked, retryAfter } = await hit(r.key, r.limit, r.windowSec);
    if (blocked) worst = Math.max(worst, retryAfter);
  }
  if (worst > 0) {
    const mins = Math.ceil(worst / 60);
    throw new HttpError(429, `Too many attempts. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.`, undefined, worst);
  }
}

const WINDOW = 15 * 60;

export const adminLoginRules = (ip: string): Rule[] => [
  { key: `admin:ip:${ip}`, limit: 6, windowSec: WINDOW },
  { key: "admin:global", limit: 30, windowSec: WINDOW },
];

export const participantIpRule = (ip: string): Rule => ({ key: `pl:ip:${ip}`, limit: 15, windowSec: WINDOW });
export const participantCodeRule = (code: string): Rule => ({ key: `pl:code:${code}`, limit: 6, windowSec: WINDOW });
