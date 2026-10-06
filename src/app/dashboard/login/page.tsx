import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function DashboardLoginPage() {
  if (await getSession("participant")) redirect("/dashboard");
  return (
    <>
      <PageHero eyebrow="Participant" title={<>Access your <span className="text-accent">dashboard</span></>} description="Enter your registration ID and the email you registered with." />
      <section className="py-14"><Container><LoginForm kind="participant" /></Container></section>
    </>
  );
}
