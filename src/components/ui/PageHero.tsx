import { Container } from "./Container";
import { Eyebrow } from "./SectionHeading";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description?: string }) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-white/10 pb-14 pt-32 sm:pb-20 sm:pt-40">
      <div aria-hidden className="absolute -right-1/4 -top-1/2 -z-10 size-[80vmin] rounded-full bg-accent/15 blur-[140px]" />
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,10vw,8rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-balance">{title}</h1>
        {description && <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{description}</p>}
      </Container>
    </section>
  );
}
