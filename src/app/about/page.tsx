import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { WhyRunNation } from "@/components/why/WhyRunNation";
import { FinalCta } from "@/components/layout/FinalCta";

export const metadata: Metadata = {
  title: "About",
  description: "RunNation India makes premium virtual running accessible to every runner in the country.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  ["Every runner counts", "Whether it is your first 5K or your fiftieth half marathon, your finish deserves the same standard."],
  ["Premium, honestly", "A medal worth keeping, a certificate worth sharing and a process that is clear from start to finish."],
  ["Run on your terms", "No travel, no queues, no fixed start line. Your route and your day."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title={<>Running has no <span className="text-accent">start line.</span></>} description="RunNation India is a premium virtual running platform built for Indian runners. We take the best parts of race day and bring them to your own road." />
      <section className="py-20 sm:py-28">
        <Container>
          <ul className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {PRINCIPLES.map(([t, d]) => (
              <li key={t} className="bg-charcoal p-8 sm:p-10">
                <h2 className="font-display text-3xl font-bold uppercase leading-none">{t}</h2>
                <p className="mt-4 text-sm leading-relaxed text-mist">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <WhyRunNation />
      <FinalCta />
    </>
  );
}
