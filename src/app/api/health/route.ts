import { NextResponse } from "next/server";

/**
 * Deployment diagnostic. Reports only whether settings are present, never their values.
 * Safe to delete once the deployment is verified.
 */
export async function GET() {
  const admin = process.env.ADMIN_PASSWORD;
  const session = process.env.SESSION_SECRET;
  return NextResponse.json(
    {
      commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7),
      environment: process.env.VERCEL_ENV ?? "local",
      adminPasswordSet: Boolean(admin),
      adminPasswordHasEdgeWhitespace: admin ? admin !== admin.trim() : false,
      sessionSecretOk: (session?.length ?? 0) >= 16,
      databaseConfigured: Boolean(process.env.DATABASE_URL),
      // Variable NAMES only, to spot misspelled keys such as "Admin_Password".
      adminLikeKeyNames: Object.keys(process.env).filter((k) => /admin|session/i.test(k)),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
