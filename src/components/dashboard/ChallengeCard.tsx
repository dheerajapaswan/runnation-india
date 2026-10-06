import { Award, Check, Download, FileCheck2, Lock, X } from "lucide-react";
import { getDistance } from "@/data/distances";
import { UPCOMING_EVENT } from "@/data/event";
import { cn, formatInr, formatLongDate } from "@/lib/utils";
import type { Participant } from "@/types";

type StepState = "done" | "current" | "error" | "todo";

const MEDAL_INDEX: Record<Participant["medalStatus"], number> = { not_ready: 0, packed: 1, shipped: 2, delivered: 3 };

function buildSteps(p: Participant): { label: string; state: StepState }[] {
  const submitted = p.proofStatus !== "not_submitted";
  const reviewing = p.proofStatus === "submitted";
  const decided = p.proofStatus === "approved" || p.proofStatus === "rejected";
  const approved = p.proofStatus === "approved";
  const m = MEDAL_INDEX[p.medalStatus];
  const medalStep = (n: number): StepState => (!approved ? "todo" : m >= n ? "done" : m === n - 1 ? "current" : "todo");
  return [
    { label: "Proof submitted", state: submitted ? "done" : p.paymentStatus === "paid" ? "current" : "todo" },
    { label: "Verification", state: decided ? "done" : reviewing ? "current" : "todo" },
    { label: p.proofStatus === "rejected" ? "Rejected" : "Approved", state: approved ? "done" : p.proofStatus === "rejected" ? "error" : "todo" },
    { label: "Premium medal packed", state: medalStep(1) },
    { label: "Shipped", state: medalStep(2) },
    { label: "Delivered", state: medalStep(3) },
  ];
}

function progressOf(p: Participant): { pct: number; label: string } {
  switch (p.proofStatus) {
    case "not_submitted": return { pct: 0, label: "Not submitted" };
    case "submitted": return { pct: 17, label: "Under review" };
    case "rejected": return { pct: 33, label: "Rejected" };
    case "approved":
      return { not_ready: { pct: 50, label: "Approved" }, packed: { pct: 67, label: "Medal packed" }, shipped: { pct: 83, label: "Shipped" }, delivered: { pct: 100, label: "Delivered" } }[p.medalStatus];
  }
}

function Note({ p }: { p: Participant }) {
  const base = "mt-8 border p-5 sm:p-6";
  if (p.paymentStatus !== "paid")
    return (
      <div className={cn(base, "border-accent/40 bg-accent/5")}>
        <p className="font-display text-2xl font-bold uppercase text-accent">Payment pending</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-bone/80">
          <li>Your registration is saved. Online payment is not live yet.</li>
          <li>Your E-BIB and proof submission unlock as soon as your payment is confirmed by the team.</li>
        </ul>
      </div>
    );
  if (p.proofStatus === "approved") {
    const medalLine = {
      not_ready: "Your premium finisher medal is now being prepared. Dispatch begins after the event window closes, so please wait until then.",
      packed: "Your premium finisher medal is packed and will be handed to the courier soon.",
      shipped: "Your premium finisher medal has been shipped to your delivery address.",
      delivered: "Your premium finisher medal has been delivered. Congratulations!",
    }[p.medalStatus];
    return (
      <div className={cn(base, "border-emerald-400/40 bg-emerald-400/5")}>
        <p className="flex items-center gap-3 font-display text-2xl font-bold uppercase text-emerald-300"><Award aria-hidden className="size-6" /> Proof approved. Congratulations, finisher!</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-bone/80">
          <li>Your proof has been verified successfully.</li>
          <li>You can now download your <strong className="text-bone">E-certificate</strong> from this page{p.paymentStatus === "paid" && <> and your <strong className="text-bone">E-BIB</strong></>}.</li>
          <li>{medalLine}</li>
          <li>Your result appears on the <strong className="text-bone">Finisher Wall</strong>, ranked by finish time.</li>
        </ul>
      </div>
    );
  }
  if (p.proofStatus === "rejected")
    return (
      <div className={cn(base, "border-red-400/40 bg-red-400/5")}>
        <p className="font-display text-2xl font-bold uppercase text-red-300">Proof needs another look</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-bone/80">
          <li>We could not verify your last proof.</li>
          <li>Please submit a clearer screenshot below showing distance, time, date and route.</li>
        </ul>
      </div>
    );
  if (p.proofStatus === "submitted")
    return (
      <div className={cn(base, "border-accent/40 bg-accent/5")}>
        <p className="font-display text-2xl font-bold uppercase text-accent">Proof received</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-bone/80">
          <li>Your proof is being verified. This page updates when the review is done.</li>
          <li>Once approved you can download your E-certificate here.</li>
        </ul>
      </div>
    );
  return (
    <div className={cn(base, "border-white/15 bg-white/[0.02]")}>
      <p className="font-display text-2xl font-bold uppercase">Ready to submit your run</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-bone/80">
        <li>Complete your {getDistance(p.distanceId).name} and upload a screenshot from your running app below.</li>
        <li>Matching proofs are verified automatically, then your E-certificate unlocks and your medal is prepared.</li>
      </ul>
    </div>
  );
}

export function ChallengeCard({ p }: { p: Participant }) {
  const d = getDistance(p.distanceId);
  const steps = buildSteps(p);
  const progress = progressOf(p);
  const certReady = p.proofStatus === "approved" && p.certificateIssued;

  return (
    <article aria-labelledby="challenge-title" className="border border-white/10 bg-charcoal p-6 sm:p-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="challenge-title" className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-5xl">
            {UPCOMING_EVENT.name.replace("RUNNATION", "RunNation")} <span className="text-accent">· {d.label}</span>
          </h2>
          <p className="mt-2 text-sm text-mist">Registered {formatLongDate(p.registeredAt)}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-300" /> Active
        </span>
      </header>

      <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[["Amount", formatInr(p.amountInr)], ["Distance", d.name], ["Registration ID", p.code], ["BIB number", String(p.bibNumber ?? "-")]].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{k}</dt>
            <dd className="mt-1 font-display text-2xl font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">
          <span>Progress</span>
          <span className={cn(p.proofStatus === "approved" && "text-emerald-300", p.proofStatus === "rejected" && "text-red-300", p.proofStatus === "submitted" && "text-accent")}>{progress.label}</span>
        </div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.pct} aria-label="Proof verification progress" className="mt-3 h-2 w-full bg-white/10">
          <div className={cn("h-full transition-all duration-700", p.proofStatus === "rejected" ? "bg-red-400" : "bg-gradient-to-r from-accent to-[#ffb020]")} style={{ width: `${progress.pct}%` }} />
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Track your progress</p>
        <ol className="mt-6 grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {steps.map((s, i) => (
            <li key={s.label} aria-current={s.state === "current" ? "step" : undefined} className="flex flex-col items-center gap-3 text-center">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-full border text-sm font-bold",
                  s.state === "done" && "border-accent bg-accent text-ink",
                  s.state === "current" && "border-accent text-accent shadow-[0_0_0_4px_rgb(255_90_31/0.18)]",
                  s.state === "error" && "border-red-400 bg-red-400 text-ink",
                  s.state === "todo" && "border-white/20 text-mist",
                )}
              >
                {s.state === "done" ? <Check aria-hidden className="size-5" /> : s.state === "error" ? <X aria-hidden className="size-5" /> : i + 1}
              </span>
              <span className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", s.state === "todo" ? "text-mist" : "text-bone")}>{s.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        {p.proofStatus !== "not_submitted" && p.runDate ? (
          <p className="inline-flex w-fit items-center gap-3 whitespace-nowrap border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em]">
            <FileCheck2 aria-hidden className="size-4 text-accent" />
            Proof · {formatLongDate(p.runDate)} · {p.finishTime}
          </p>
        ) : (
          <span />
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          {certReady ? (
            <a
              href="/api/certificate"
              download
              className="inline-flex min-h-14 items-center justify-center gap-3 whitespace-nowrap bg-gradient-to-r from-[#ffb020] to-accent px-7 font-display text-lg font-bold uppercase tracking-[0.14em] text-ink shadow-[0_12px_40px_-12px_rgb(255_90_31/0.7)] transition-transform hover:-translate-y-0.5"
            >
              <Download aria-hidden className="size-5" /> Download E-certificate
            </a>
          ) : (
            <span aria-disabled="true" className="inline-flex min-h-14 items-center justify-center gap-3 whitespace-nowrap border border-white/15 px-7 font-display text-lg font-bold uppercase tracking-[0.14em] text-mist">
              <Lock aria-hidden className="size-5" /> E-certificate after approval
            </span>
          )}
          {p.paymentStatus === "paid" ? (
            <a
              href="/api/bib"
              download
              className="inline-flex min-h-14 items-center justify-center gap-3 whitespace-nowrap bg-gradient-to-r from-accent to-[#e0261b] px-7 font-display text-lg font-bold uppercase tracking-[0.14em] text-bone shadow-[0_12px_40px_-12px_rgb(224_38_27/0.6)] transition-transform hover:-translate-y-0.5"
            >
              <Download aria-hidden className="size-5" /> Download E-BIB
            </a>
          ) : (
            <span aria-disabled="true" className="inline-flex min-h-14 items-center justify-center gap-3 whitespace-nowrap border border-white/15 px-7 font-display text-lg font-bold uppercase tracking-[0.14em] text-mist">
              <Lock aria-hidden className="size-5" /> E-BIB after payment
            </span>
          )}
        </div>
      </div>

      <Note p={p} />
    </article>
  );
}
