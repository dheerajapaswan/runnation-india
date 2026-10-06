import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DISTANCES, getPricing } from "@/data/distances";
import { PricingCard } from "./PricingCard";

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="pricing-title"
          eyebrow="Distances & pricing"
          title={<>Pick your <span className="text-accent">distance.</span></>}
          description="One simple fee. Every distance includes the finisher medal, E-BIB, e-certificate and a place on the Finisher Wall."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {DISTANCES.map((d, i) => (
            <Reveal key={d.id} delay={i * 100} className="h-full">
              <PricingCard distance={d} pricing={getPricing(d.id)} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
