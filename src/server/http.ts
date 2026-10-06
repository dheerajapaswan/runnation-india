import "server-only";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { getSession, type Role } from "@/lib/auth/session";

export class HttpError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

export const ok = <T,>(data: T, status = 200) => NextResponse.json({ success: true, data }, { status });

function fail(status: number, message: string, fields?: Record<string, string>) {
  return NextResponse.json({ success: false, message, ...(fields ? { fields } : {}) }, { status });
}

/** Maps any thrown error to a safe JSON response. Never leaks internals. */
export async function handle(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HttpError) return fail(e.status, e.message, e.fields);
    if (e instanceof ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of e.issues) fields[String(issue.path[0] ?? "body")] ??= issue.message;
      return fail(400, "Validation failed", fields);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") return fail(409, "Record already exists");
      if (e.code === "P2025") return fail(404, "Record not found");
      if (e.code === "P2003") return fail(400, "Invalid reference");
      if (e.code === "P1001" || e.code === "P1002" || e.code === "P1008") return fail(503, "Service temporarily unavailable");
    }
    if (e instanceof Prisma.PrismaClientInitializationError) return fail(503, "Service temporarily unavailable");
    if (e instanceof SyntaxError) return fail(400, "Invalid request body");
    console.error("[api] unexpected error:", e instanceof Error ? e.name : "unknown");
    return fail(500, "Something went wrong");
  }
}

export async function requireSession(role: Role): Promise<string> {
  const sub = await getSession(role);
  if (!sub) throw new HttpError(401, "Not authenticated");
  return sub;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, "Invalid request body");
  }
}
