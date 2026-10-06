export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  message?: string;
  fields?: Record<string, string>;
}

/** Thin client for the app's JSON API envelope: { success, data | message, fields? }. */
export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<ApiResult<T>> {
  try {
    const { json, ...rest } = init ?? {};
    const res = await fetch(url, {
      ...rest,
      headers: json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
    const body = (await res.json()) as { success: boolean; data?: T; message?: string; fields?: Record<string, string> };
    return body.success ? { ok: true, data: body.data } : { ok: false, message: body.message, fields: body.fields };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
