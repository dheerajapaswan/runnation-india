"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Participant, ProofStatus } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDistance } from "@/data/distances";
import { api } from "@/lib/api";

export function ProofQueue({ initial }: { initial: Participant[] }) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, ProofStatus>>(
    Object.fromEntries(initial.map((p) => [p.id, p.proofStatus])),
  );
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const decide = async (p: Participant, status: "approved" | "rejected") => {
    if (!p.proofId) return;
    setBusyId(p.id);
    setError("");
    const res = await api(`/api/admin/proofs/${p.proofId}`, { method: "PATCH", json: { status } });
    setBusyId(null);
    if (!res.ok) return setError(res.message ?? "Could not update proof.");
    setState((x) => ({ ...x, [p.id]: status }));
    router.refresh();
  };

  if (initial.length === 0) return <p className="text-mist">No proofs waiting for review.</p>;

  return (
    <>
      {error && <p role="alert" className="mb-3 text-sm text-[#ff8a6b]">{error}</p>}
      <ul className="divide-y divide-white/10 border border-white/10">
        {initial.map((p) => {
          const s = state[p.id];
          return (
            <li key={p.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{p.name} <span className="text-mist">· {p.code}</span></p>
                <p className="mt-1 text-sm text-mist">{getDistance(p.distanceId).label} · {p.finishTime} · {p.proofApp} · {p.runDate}</p>
                {p.analysisNote && <p className="mt-1 text-xs text-bone/70">Auto-check: {p.analysisNote}</p>}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={s} />
                <button type="button" onClick={() => decide(p, "approved")} disabled={s === "approved" || busyId === p.id} className="min-h-11 border border-emerald-400/40 px-4 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-40" aria-label={`Approve proof for ${p.name}`}>Approve</button>
                <button type="button" onClick={() => decide(p, "rejected")} disabled={s === "rejected" || busyId === p.id} className="min-h-11 border border-red-400/40 px-4 text-sm font-semibold text-red-300 hover:bg-red-400/10 disabled:opacity-40" aria-label={`Reject proof for ${p.name}`}>Reject</button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
