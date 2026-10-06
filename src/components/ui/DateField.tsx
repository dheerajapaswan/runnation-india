"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();

function Select({ id, label, value, onChange, children, invalid, describedBy, className }: {
  id?: string; label: string; value: string; onChange: (v: string) => void; children: React.ReactNode; invalid?: boolean; describedBy?: string; className?: string;
}) {
  return (
    <div className={className}>
      <select
        id={id}
        aria-label={label}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-h-12 w-full border bg-transparent pl-4 pr-9 text-base focus:border-accent focus:outline-none",
          invalid ? "border-[#ff8a6b]" : "border-white/15",
          value === "" && "text-mist/70",
        )}
      >
        {children}
      </select>
    </div>
  );
}

/**
 * Themed day / month / year picker. Emits an ISO date (YYYY-MM-DD) or "" until complete.
 * Renders a hidden input when `name` is given so it works with plain FormData forms.
 */
export function DateField({
  id, name, onChange, minYear, maxYear, invalid, describedBy, newestFirst = true,
}: {
  id?: string;
  name?: string;
  onChange?: (iso: string) => void;
  minYear: number;
  maxYear: number;
  invalid?: boolean;
  describedBy?: string;
  newestFirst?: boolean;
}) {
  const [p, setP] = useState({ d: "", m: "", y: "" });

  const update = (next: { d: string; m: string; y: string }) => {
    // Clamp the day if the month/year change makes it invalid (e.g. 31 Feb).
    if (next.d && next.m && next.y && Number(next.d) > daysIn(Number(next.y), Number(next.m))) {
      next = { ...next, d: String(daysIn(Number(next.y), Number(next.m))) };
    }
    setP(next);
    const iso = next.d && next.m && next.y ? `${next.y}-${next.m.padStart(2, "0")}-${next.d.padStart(2, "0")}` : "";
    onChange?.(iso);
  };

  const maxDay = p.m && p.y ? daysIn(Number(p.y), Number(p.m)) : p.m ? daysIn(2024, Number(p.m)) : 31;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (newestFirst ? maxYear - i : minYear + i));
  const iso = p.d && p.m && p.y ? `${p.y}-${p.m.padStart(2, "0")}-${p.d.padStart(2, "0")}` : "";

  return (
    <div role="group" aria-label="Date" className="grid grid-cols-[6rem_1fr_7rem] gap-2">
      <Select id={id} label="Day" value={p.d} onChange={(d) => update({ ...p, d })} invalid={invalid} describedBy={describedBy}>
        <option value="" className="bg-ink">Day</option>
        {Array.from({ length: maxDay }, (_, i) => <option key={i} value={String(i + 1)} className="bg-ink">{i + 1}</option>)}
      </Select>
      <Select label="Month" value={p.m} onChange={(m) => update({ ...p, m })} invalid={invalid}>
        <option value="" className="bg-ink">Month</option>
        {MONTHS.map((n, i) => <option key={n} value={String(i + 1)} className="bg-ink">{n}</option>)}
      </Select>
      <Select label="Year" value={p.y} onChange={(y) => update({ ...p, y })} invalid={invalid}>
        <option value="" className="bg-ink">Year</option>
        {years.map((y) => <option key={y} value={String(y)} className="bg-ink">{y}</option>)}
      </Select>
      {name && <input type="hidden" name={name} value={iso} />}
    </div>
  );
}
