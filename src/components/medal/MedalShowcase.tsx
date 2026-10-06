import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";
import { MedalVisual } from "./MedalVisual";

export function MedalShowcase() {
  return (
    <section id="medal" aria-labelledby="medal-title" className="relative isolate overflow-hidden border-y border-white/10 bg-ink py-24 sm:py-32">
      {/* spotlight */}
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-full w-[140%] max-w-[1400px] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_-10%,transparent_160deg,rgb(255_255_255/0.13)_180deg,transparent_200deg)]" />
      <div aria-hidden className="absolute left-1/2 top-[55%] -z-10 size-[120vmin] max-h-[900px] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <Container className="flex flex-col items-center text-center">
        <Eyebrow>The medal</Eyebrow>
        <h2 id="medal-title" className="mt-5 font-display text-[clamp(2.75rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-balance">
          Earn your <span className="text-accent">finisher</span> medal
        </h2>

        <Reveal className="relative mt-14 w-full max-w-[22rem] sm:max-w-md">
          <div className="relative mx-auto aspect-[400/560] w-[78%] animate-float motion-reduce:animate-none">
            <MediaImage src={SITE.medalImage} alt="RunNation India finisher medal" sizes="(min-width:640px) 28rem, 80vw" fallback={<MedalVisual />} className="object-contain" />
            <div aria-hidden className="pointer-events-none absolute inset-x-[10%] bottom-[2%] top-[42%] overflow-hidden rounded-full">
              <div className="h-full w-1/4 animate-sheen bg-white/25 blur-xl motion-reduce:hidden" />
            </div>
          </div>
          <div aria-hidden className="mx-auto mt-6 h-6 w-3/5 rounded-[100%] bg-black/80 blur-xl" />
        </Reveal>

        <p className="mt-10 font-display text-2xl font-semibold uppercase tracking-[0.18em] text-bone sm:text-3xl">
          Designed to be earned. <span className="block text-mist sm:inline">Built to be remembered.</span>
        </p>
      </Container>
    </section>
  );
}
