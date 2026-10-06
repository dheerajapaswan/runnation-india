"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const btn = "min-h-9 border border-white/20 px-3 text-xs font-semibold hover:border-bone disabled:opacity-40";
const NEXT: Record<string, "packed" | "shipped" | "delivered" | undefined> = { not_ready: "packed", packed: "shipped", shipped: "delivered" };

export function ParticipantActions({ id, paymentStatus, medalStatus, proofApproved }: { id: string; paymentStatus: string; medalStatus: string; proofApproved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const patch = async (json: Record<string, string>) => {
    setBusy(true);
    setError("");
    const res = await api(`/api/admin/registrations/${id}`, { method: "PATCH", json });
    setBusy(false);
    if (!res.ok) return setError(res.message ?? "Update failed.");
    router.refresh();
  };

  const next = NEXT[medalStatus];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {paymentStatus !== "paid" && <button type="button" disabled={busy} className={btn} onClick={() => patch({ paymentStatus: "paid" })}>Mark paid</button>}
      {proofApproved && next && <button type="button" disabled={busy} className={btn} onClick={() => patch({ medalStatus: next })}>Mark {next}</button>}
      {error && <span role="alert" className="text-xs text-[#ff8a6b]">{error}</span>}
    </div>
  );
}
