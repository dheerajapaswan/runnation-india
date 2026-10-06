import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Talk to the <span className="text-accent">team</span></>} description="Questions about registration, proof or your medal? We reply as quickly as we can." />
      <section className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <a href="mailto:hello@runverse.in" className="group flex items-center justify-between gap-4 border border-white/15 p-6 transition-colors hover:border-accent sm:p-8">
            <span className="flex items-center gap-4">
              <Mail aria-hidden className="size-6 text-accent" />
              <span className="font-display text-3xl font-bold sm:text-4xl">hello@runverse.in</span>
            </span>
            <span className="text-sm text-mist group-hover:text-bone">Email us</span>
          </a>
        </Container>
      </section>
    </>
  );
}
