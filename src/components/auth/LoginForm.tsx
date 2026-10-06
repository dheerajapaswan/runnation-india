"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const input = "min-h-12 w-full border border-white/15 bg-transparent px-4 text-base focus:border-accent focus:outline-none";
const label = "mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-bone/80";

export function LoginForm({ kind }: { kind: "admin" | "participant" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res =
      kind === "admin"
        ? await api("/api/admin/login", { method: "POST", json: { password: f.get("password") } })
        : await api("/api/participant/login", { method: "POST", json: { code: f.get("code"), email: f.get("email") } });
    setBusy(false);
    if (!res.ok) {
      setError(res.message === "Validation failed" ? Object.values(res.fields ?? {})[0] ?? "Check your details." : (res.message ?? "Could not sign in."));
      return;
    }
    router.replace(kind === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5" aria-describedby={error ? "login-err" : undefined}>
      {kind === "admin" ? (
        <div>
          <label htmlFor="password" className={label}>Admin password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="code" className={label}>Registration ID</label>
            <input id="code" name="code" placeholder="RV26-A1B2C3" autoComplete="off" required className={input} />
          </div>
          <div>
            <label htmlFor="email" className={label}>Email used to register</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={input} />
          </div>
        </>
      )}
      {error && <p id="login-err" role="alert" className="text-sm text-[#ff8a6b]">{error}</p>}
      <button type="submit" disabled={busy} className="min-h-12 w-full bg-accent font-display text-base font-bold uppercase tracking-[0.14em] text-ink hover:bg-bone disabled:opacity-60">
        {busy ? "Signing in" : "Sign in"}
      </button>
      {kind === "participant" && (
        <p className="text-sm text-mist">
          New here? <Link href="/register" className="font-semibold text-accent hover:text-bone">Sign up</Link>
        </p>
      )}
    </form>
  );
}
