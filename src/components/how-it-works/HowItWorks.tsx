import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  { n: "01", title: "Register", body: "Choose your distance and register." },
  { n: "02", title: "Run Anywhere", body: "Complete your selected distance during the event window." },
  { n: "03", title: "Submit Proof", body: "Upload GPS/activity proof from a supported running app." },
  { n: "04", title: "Earn Your Finish", body: "Receive your e-certificate and finisher medal." },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative border-y border-white/10 bg-charcoal py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title={<>Four steps. <span className="text-accent">One finish.</span></>}
        />

        <ol className="relative mt-16 grid gap-0 lg:mt-24 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-accent/60 to-accent lg:left-0 lg:right-0 lg:top-[1.15rem] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} as="li" delay={i * 120} className="group relative pb-12 pl-14 last:pb-0 lg:pb-0 lg:pl-0 lg:pt-14">
              <span
                aria-hidden
                className={`absolute left-0 top-1 grid size-[2.3rem] place-items-center rounded-full border text-xs font-bold lg:top-0 ${i === 3 ? "border-accent bg-accent text-ink" : "border-white/25 bg-charcoal text-bone transition-colors group-hover:border-accent"}`}
              >
                {i + 1}
              </span>
              <p
                aria-hidden
                className="font-display text-[clamp(5rem,9vw,8rem)] font-extrabold leading-none text-outline transition-colors duration-500 group-hover:text-accent/80"
              >
                {s.n}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide">{s.title}</h3>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-mist">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
