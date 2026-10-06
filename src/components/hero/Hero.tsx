import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MediaImage } from "@/components/ui/MediaImage";
import { SITE } from "@/data/site";
import { DISTANCES } from "@/data/distances";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="grain relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:flex lg:min-h-dvh lg:items-center lg:pb-20 lg:pt-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 left-0 right-0 lg:left-[22%] lg:[mask-image:linear-gradient(to_right,transparent,black_38%)]">
          <MediaImage src={SITE.heroImage} alt="" priority sizes="100vw" fallback={null} className="object-cover object-[50%_40%]" />
        </div>
        {SITE.heroImage && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
          </>
        )}
        <div className="absolute -right-1/4 -top-1/3 size-[90vmin] animate-drift rounded-full bg-accent/20 blur-[140px] motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:25%_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            <span aria-hidden className="h-px w-8 bg-accent" />
            India&rsquo;s premium virtual running experience
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(3.5rem,13.5vw,9.5rem)] font-extrabold uppercase leading-[0.86] tracking-tight"
          >
            Run anywhere.
            <span className="block text-accent">Finish with glory.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
            Choose your distance, run your route, submit your proof and earn your finisher medal.
          </p>

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8" aria-label="Distances">
            {DISTANCES.map((d, i) => (
              <li key={d.id} className="flex items-center gap-6 sm:gap-8">
                <span className="font-display text-3xl font-bold tracking-wide sm:text-4xl">{d.label}</span>
                {i < DISTANCES.length - 1 && <span aria-hidden className="hidden h-6 w-px rotate-12 bg-white/25 sm:block" />}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={SITE.registerHref} size="lg">Register Now</Button>
            <Button href="/events" variant="ghost" size="lg" arrow={false}>Explore Event</Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
