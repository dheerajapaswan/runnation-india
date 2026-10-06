import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getSession("admin")) redirect("/admin");
  return (
    <>
      <PageHero eyebrow="Admin" title={<>Admin <span className="text-accent">sign in</span></>} />
      <section className="py-14"><Container><LoginForm kind="admin" /></Container></section>
    </>
  );
}
