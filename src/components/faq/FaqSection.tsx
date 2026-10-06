import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQS } from "@/data/faq";
import { FaqAccordion } from "./FaqAccordion";

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="faq-title" eyebrow="FAQ" title={<>Got <span className="text-accent">questions?</span></>} description="Everything you need to know before your first virtual start line." />
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={FAQS} />
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
