import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { DISTANCES } from "@/data/distances";
import type { DistanceId } from "@/types";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for RUNNATION VIRTUAL RUN 2026. Choose 3K, 5K, 10K or 21.1K Half Marathon.",
  alternates: { canonical: "/register" },
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ distance?: string }> }) {
  const { distance } = await searchParams;
  const initial: DistanceId = DISTANCES.find((d) => d.id === distance)?.id ?? "10k";
  return (
    <>
      <PageHero eyebrow="Register" title={<>Claim your <span className="text-accent">start line</span></>} description="Choose your distance and tell us where to send your medal. Your E-BIB unlocks once payment is confirmed. Already registered? Sign in from the Login button." />
      <section className="py-14 sm:py-20">
        <Container><RegistrationForm initialDistance={initial} /></Container>
      </section>
    </>
  );
}
