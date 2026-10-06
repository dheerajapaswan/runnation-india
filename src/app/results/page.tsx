import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ResultsExplorer } from "@/components/results/ResultsExplorer";
import { listResults } from "@/lib/repositories/results";

export const metadata: Metadata = {
  title: "Results",
  description: "Browse verified finishers across 3K, 5K, 10K and 21.1K Half Marathon.",
  alternates: { canonical: "/results" },
};

export const revalidate = 60;

export default async function ResultsPage() {
  const results = await listResults();
  return (
    <>
      <PageHero eyebrow="Results" title={<>The Finisher <span className="text-accent">Wall</span></>} description="Every verified runner, every distance." />
      <section className="py-14 sm:py-20">
        <Container><ResultsExplorer results={results} /></Container>
      </section>
    </>
  );
}
