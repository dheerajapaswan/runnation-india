import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingSection } from "@/components/pricing/PricingSection";
import { FinalCta } from "@/components/layout/FinalCta";
import { UPCOMING_EVENT } from "@/data/event";

export const metadata: Metadata = {
  title: "Events",
  description: "RUNNATION VIRTUAL RUN 2026: choose 3K, 5K, 10K or 21.1K Half Marathon and run anywhere in India.",
  alternates: { canonical: "/events" },
};

const TIMELINE = [
  ["Registration", "Open now. Pick your distance and register. Your E-BIB unlocks once payment is confirmed."],
  ["Event window", "Dates announced soon. Run your distance on any day inside the window."],
  ["Proof submission", "Upload your GPS activity after your run."],
  ["Verification & results", "Approved runners appear on the Finisher Wall, ranked by finish time, and can download their e-certificate."],
  ["Medal dispatch", "Finisher medals ship after the window closes and verification is complete."],
] as const;

const RULES = [
  "Complete your registered distance in a single continuous activity.",
  "Record the run with a GPS running app or watch that shows distance, time, date and route.",
  "Run outdoors on any route you like. Treadmill runs are not eligible.",
  "Run inside the event window and submit proof before the deadline.",
  "Run safely and follow local traffic rules.",
];

export default function EventsPage() {
  const e = UPCOMING_EVENT;
  return (
    <>
      <PageHero eyebrow="Events" title={<>RunNation <span className="text-accent">Virtual Run</span> 2026</>} description={e.tagline} />
      <section className="py-20 sm:py-28" aria-labelledby="timeline-title">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="timeline-title" eyebrow="Timeline" title={<>How the event <span className="text-accent">unfolds</span></>} description={e.dateLabel} />
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
            {TIMELINE.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="font-display text-3xl font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mist">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <PricingSection />
      <section className="border-t border-white/10 bg-charcoal py-20 sm:py-28" aria-labelledby="rules-title">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="rules-title" eyebrow="Rules" title={<>Run it <span className="text-accent">right</span></>} />
          </div>
          <ul className="space-y-4 lg:col-span-7">
            {RULES.map((r) => (
              <li key={r} className="flex gap-4 border-b border-white/10 pb-4 text-base text-bone/85">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />{r}
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
