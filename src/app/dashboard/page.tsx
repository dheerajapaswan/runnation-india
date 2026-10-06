import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Medal, MessageCircle, ScrollText, Share2 } from "lucide-react";
import { ChallengeCard } from "@/components/dashboard/ChallengeCard";
import { FollowCard } from "@/components/dashboard/FollowCard";
import { ShareButton } from "@/components/dashboard/ShareButton";
import { SITE } from "@/data/site";
import { getDistance } from "@/data/distances";
import { ProofForm } from "@/components/dashboard/ProofForm";
import { getCurrentParticipant } from "@/lib/repositories/participants";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const p = await getCurrentParticipant();
  if (!p) redirect("/dashboard/login");
  const approved = p.proofStatus === "approved";
  const canSubmit = p.paymentStatus === "paid" && !approved;
  const km = approved ? getDistance(p.distanceId).kilometres : 0;
  const stats = [
    ["Total km", km.toFixed(1)],
    ["Total challenges", "1"],
    ["Premium medals earned", approved ? "1" : "0"],
  ];

  return (
    <>
      <PageHero eyebrow="Dashboard" title={<>Welcome back, <span className="text-accent">{p.name.split(" ")[0]}</span></>} description={`Registration ${p.code}`} />
      <section className="py-14 sm:py-20">
        <Container className="space-y-12">
          <dl className="grid gap-4 sm:grid-cols-3">
            {stats.map(([k, v]) => (
              <div key={k} className="border border-white/10 bg-charcoal p-6">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{k}</dt>
                <dd className="mt-2 font-display text-5xl font-extrabold text-accent">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-5 border border-white/10 bg-charcoal p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-5">
              <span className="grid size-14 shrink-0 place-items-center bg-accent/15 text-accent"><Share2 aria-hidden className="size-6" /></span>
              <div>
                <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">Invite your friends to RunNation</h2>
                <p className="mt-1 text-sm text-mist">Share the challenge link and run together. Every friend who joins pushes the squad forward.</p>
              </div>
            </div>
            <ShareButton title="RunNation Virtual Run 2026" text="Join me for the RunNation Virtual Run 2026. Run anywhere, finish with glory." path="/register" />
          </div>

          <div>
            <h2 className="mb-5 font-display text-3xl font-bold uppercase sm:text-4xl">Active challenges</h2>
            <ChallengeCard p={p} />
          </div>

          {canSubmit && (
            <div>
              <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">{p.proofStatus === "rejected" ? "Resubmit run proof" : "Submit run proof"}</h2>
              <p className="mb-5 mt-2 text-sm text-mist">Upload a screenshot or export showing distance, time, date and GPS route. Max 5 MB.</p>
              <div className="max-w-3xl"><ProofForm /></div>
            </div>
          )}

          <div>
            <h2 className="mb-5 font-display text-3xl font-bold uppercase sm:text-4xl">My rewards</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Medal, label: "Premium medals", value: approved ? 1 : 0 },
                { icon: ScrollText, label: "Certificates", value: p.certificateIssued ? 1 : 0 },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-5 border border-white/10 bg-charcoal p-6">
                  <Icon aria-hidden className="size-10 text-accent" strokeWidth={1.25} />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{label}</p>
                    <p className="font-display text-4xl font-extrabold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <FollowCard
              tone="bg-gradient-to-r from-[#d6249f] via-[#fd5949] to-[#fdb92d]"
              icon={<svg viewBox="0 0 24 24" aria-hidden className="size-7 fill-current"><path d={INSTAGRAM_PATH} /></svg>}
              title="Follow us on Instagram"
              body="Share your fitness journey, explore our latest challenges and become part of the RunNation community."
              href={SITE.social.instagram}
              cta="Follow now"
            />
            <FollowCard
              tone="bg-[#1faa59]"
              icon={<MessageCircle aria-hidden className="size-7" />}
              title="Follow RunNation on WhatsApp"
              body="Get event updates, results and announcements straight to your phone."
              href={SITE.social.whatsapp}
              cta="Join channel"
            />
          </div>

          <LogoutButton kind="participant" />
        </Container>
      </section>
    </>
  );
}

const INSTAGRAM_PATH =
  "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z";
