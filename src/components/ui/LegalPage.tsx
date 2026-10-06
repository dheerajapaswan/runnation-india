import { PageHero } from "./PageHero";
import { Container } from "./Container";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={intro} />
      <section className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <p className="mb-10 border border-accent/40 bg-accent/5 p-4 text-sm text-bone/85">
            Draft policy. This text must be reviewed and finalised by your legal adviser before launch.
          </p>
          {sections.map((s, i) => (
            <section key={s.heading} aria-labelledby={`legal-${i}`} className="mb-10">
              <h2 id={`legal-${i}`} className="font-display text-3xl font-bold uppercase tracking-wide">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-mist">{p}</p>
              ))}
            </section>
          ))}
        </Container>
      </section>
    </>
  );
}
