import { Hero } from "@/components/hero/Hero";
import { UpcomingEvent } from "@/components/events/UpcomingEvent";
import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { PricingSection } from "@/components/pricing/PricingSection";
import { MedalShowcase } from "@/components/medal/MedalShowcase";
import { WhyRunNation } from "@/components/why/WhyRunNation";
import { FinisherWall } from "@/components/results/FinisherWall";
import { FaqSection } from "@/components/faq/FaqSection";
import { FinalCta } from "@/components/layout/FinalCta";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />
      <UpcomingEvent />
      <HowItWorks />
      <PricingSection />
      <MedalShowcase />
      <WhyRunNation />
      <FinisherWall />
      <FaqSection />
      <FinalCta />
    </>
  );
}
