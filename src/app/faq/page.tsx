import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FaqSection } from "@/components/faq/FaqSection";
import { FinalCta } from "@/components/layout/FinalCta";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about virtual runs, proof submission, medals, E-BIB, certificates, refunds and the 21.1K Half Marathon.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Support" title={<>Frequently asked <span className="text-accent">questions</span></>} />
      <FaqSection />
      <FinalCta />
    </>
  );
}
