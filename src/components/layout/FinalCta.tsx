import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MediaImage } from "@/components/ui/MediaImage";
import { SITE } from "@/data/site";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="grain relative isolate overflow-hidden border-t border-white/10 py-28 sm:py-40">
      <div aria-hidden className="absolute inset-0 -z-20">
        <MediaImage src={SITE.heroImage} alt="" sizes="100vw" fallback={null} className="object-cover object-[50%_75%] opacity-45" />
        {SITE.heroImage && <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink/80" />}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgb(255_90_31/0.5),transparent_60%)]" />
      <div aria-hidden className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <Container className="text-center">
        <h2 id="cta-title" className="font-display text-[clamp(3rem,11vw,9rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-balance">
          Your route. <span className="text-outline">Your distance.</span> <span className="text-accent">Your finish.</span>
        </h2>
        <div className="mt-12 flex justify-center">
          <Button href={SITE.registerHref} size="lg">Register Now</Button>
        </div>
      </Container>
    </section>
  );
}
