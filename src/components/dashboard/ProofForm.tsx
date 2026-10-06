"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DateField } from "@/components/ui/DateField";
import { CheckCircle2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const APPS = ["Strava", "Garmin Connect", "Nike Run Club", "Apple Fitness", "Google Fit", "Other"];
const MAX_MB = 5;

export function ProofForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"approved" | "review">("review");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File | null;
    const err: Record<string, string> = {};
    if (!f.get("app")) err.app = "Choose your running app.";
    if (!/^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/.test(String(f.get("time") ?? "").trim())) err.time = "Use MM:SS or H:MM:SS, for example 45:20.";
    const date = String(f.get("date") ?? "");
    if (!date) err.date = "Select the date of your run.";
    else if (new Date(date) > new Date()) err.date = "Run date cannot be in the future.";
    if (!file || file.size === 0) err.file = "Attach a screenshot or export of your run.";
    else if (!/^image\/(png|jpe?g|webp)$|^application\/pdf$/.test(file.type)) err.file = "Use a PNG, JPG, WebP or PDF file.";
    else if (file.size > MAX_MB * 1024 * 1024) err.file = `File must be under ${MAX_MB} MB.`;
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    const res = await api<{ status: "approved" | "submitted"; reasons: string[] }>("/api/proofs", { method: "POST", body: f });
    setBusy(false);
    if (!res.ok) {
      setErrors({ ...(res.fields ?? {}), ...(res.fields ? {} : { form: res.message ?? "Could not submit proof." }) });
      return;
    }
    setResult(res.data?.status === "approved" ? "approved" : "review");
    setDone(true);
    router.refresh();
  };

  if (done)
    return (
      <div role="status" className="border border-accent/40 bg-accent/5 p-6">
        <CheckCircle2 aria-hidden className="size-8 text-accent" />
        <p className="mt-3 font-display text-3xl font-bold uppercase">{result === "approved" ? "Verified. You're a finisher!" : "Proof submitted"}</p>
        <p className="mt-2 text-sm text-mist">{result === "approved" ? "Your run matched automatically. You now appear on the Finisher Wall." : "Our team will review it shortly. Your status updates on this page."}</p>
      </div>
    );

  const field = (k: string) => cn("min-h-12 w-full border bg-transparent px-4 text-base focus:border-accent focus:outline-none", errors[k] ? "border-[#ff8a6b]" : "border-white/15");
  const err = (k: string) => errors[k] && <p id={`${k}-err`} role="alert" className="mt-1.5 text-xs text-[#ff8a6b]">{errors[k]}</p>;
  const label = "mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-bone/80";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="app" className={label}>Running app</label>
        <select id="app" name="app" defaultValue="" className={field("app")} aria-invalid={!!errors.app} aria-describedby={errors.app ? "app-err" : undefined}>
          <option value="" className="bg-ink">Select</option>
          {APPS.map((a) => <option key={a} className="bg-ink">{a}</option>)}
        </select>
        {err("app")}
      </div>
      <div>
        <label htmlFor="time" className={label}>Finish time</label>
        <input id="time" name="time" placeholder="45:20" inputMode="numeric" className={field("time")} aria-invalid={!!errors.time} aria-describedby={errors.time ? "time-err" : undefined} />
        {err("time")}
      </div>
      <div>
        <label htmlFor="date" className={label}>Run date</label>
        <DateField id="date" name="date" minYear={new Date().getFullYear() - 1} maxYear={new Date().getFullYear()} invalid={!!errors.date} describedBy={errors.date ? "date-err" : undefined} />
        {err("date")}
      </div>
      <div>
        <label htmlFor="file" className={label}>Proof file</label>
        <input id="file" name="file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className={cn(field("file"), "py-2.5 file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-bone")} aria-invalid={!!errors.file} aria-describedby={errors.file ? "file-err" : undefined} />
        {err("file")}
      </div>
      {errors.form && <p role="alert" className="text-xs text-[#ff8a6b] sm:col-span-2">{errors.form}</p>}
      <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent font-display text-base font-bold uppercase tracking-[0.14em] text-ink hover:bg-bone sm:col-span-2">
        <Upload aria-hidden className="size-4" /> {busy ? "Analysing your proof…" : "Submit proof"}
      </button>
    </form>
  );
}
