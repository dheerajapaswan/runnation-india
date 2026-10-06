"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { DistanceId, Result } from "@/types";
import { cn, formatShortDate } from "@/lib/utils";

const TABS: { id: "all" | DistanceId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "3k", label: "3K" },
  { id: "5k", label: "5K" },
  { id: "10k", label: "10K" },
  { id: "21k", label: "21.1K" },
];

const LABEL: Record<DistanceId, string> = { "3k": "3K", "5k": "5K", "10k": "10K", "21k": "21.1K" };

const ORDER: DistanceId[] = ["3k", "5k", "10k", "21k"];

export function ResultsExplorer({ results }: { results: Result[] }) {
  const [tab, setTab] = useState<"all" | DistanceId>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return results
      .filter((r) => (tab === "all" || r.distanceId === tab) && (!term || `${r.runner.name} ${r.runner.city}`.toLowerCase().includes(term)))
      .sort((a, b) => ORDER.indexOf(a.distanceId) - ORDER.indexOf(b.distanceId) || a.rank - b.rank);
  }, [results, tab, q]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by distance" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn("min-h-11 border px-5 font-display text-lg font-bold uppercase tracking-wider transition-colors", tab === t.id ? "border-accent bg-accent text-ink" : "border-white/15 hover:border-white/40")}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search by name or city</span>
          <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or city"
            className="min-h-11 w-full border border-white/15 bg-transparent pl-10 pr-3 text-sm placeholder:text-mist focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-mist" aria-live="polite">
        {rows.length} {rows.length === 1 ? "finisher" : "finishers"}
      </p>

      <div className="mt-4 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[34rem] text-left">
          <caption className="sr-only">Finisher results</caption>
          <thead className="border-b border-white/10 bg-ink/60 text-[11px] uppercase tracking-[0.22em] text-mist">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Rank</th>
              <th scope="col" className="px-4 py-3 font-semibold">Runner</th>
              <th scope="col" className="px-4 py-3 font-semibold">Distance</th>
              <th scope="col" className="px-4 py-3 font-semibold">Time</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-4 py-4 font-display text-2xl font-bold text-accent">{String(r.rank).padStart(2, "0")}</td>
                <td className="px-4 py-4"><p className="font-semibold">{r.runner.name}</p><p className="text-xs text-mist">{r.runner.city}</p></td>
                <td className="px-4 py-4 font-display text-2xl font-bold">{LABEL[r.distanceId]}</td>
                <td className="px-4 py-4 font-display text-2xl font-semibold tabular-nums">{r.finishTime}</td>
                <td className="px-4 py-4 text-sm text-mist">{formatShortDate(r.date)}</td>
                <td className="px-4 py-4 text-right"><span className="border border-accent/50 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Finisher</span></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-mist">No finishers match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
