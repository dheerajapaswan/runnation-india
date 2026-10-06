import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ParticipantActions } from "@/components/admin/ParticipantActions";
import { getStats } from "@/server/services";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProofQueue } from "@/components/admin/ProofQueue";
import { listParticipants } from "@/lib/repositories/participants";
import { getDistance } from "@/data/distances";
import { formatInr } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await getSession("admin"))) redirect("/admin/login");
  const [all, s] = await Promise.all([listParticipants(), getStats()]);
  const queue = all.filter((p) => p.proofStatus === "submitted");
  const stats = [
    ["Registrations", String(s.registrations)],
    ["Paid", String(s.paid)],
    ["Revenue", formatInr(s.revenueInr)],
    ["Proofs to review", String(s.proofsToReview)],
    ["Medals to pack", String(s.medalsToPack)],
  ];

  return (
    <>
      <PageHero eyebrow="Admin" title={<>Event <span className="text-accent">control</span></>} description="Manage participants, payments, proofs, certificates and medals." />
      <section className="py-14 sm:py-20">
        <Container className="space-y-14">
          <dl className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-5">
            {stats.map(([k, v]) => (
              <div key={k} className="bg-charcoal p-5 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.2em] text-mist">{k}</dt>
                <dd className="mt-2 font-display text-4xl font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex justify-end -mb-8"><LogoutButton kind="admin" /></div>
          <div>
            <h2 className="mb-5 font-display text-3xl font-bold uppercase">Proof verification</h2>
            <ProofQueue initial={queue} />
          </div>

          <div>
            <h2 className="mb-5 font-display text-3xl font-bold uppercase">Participants</h2>
            <div className="overflow-x-auto border border-white/10">
              <table className="w-full min-w-[64rem] text-left text-sm">
                <caption className="sr-only">All participants</caption>
                <thead className="border-b border-white/10 bg-ink/60 text-[11px] uppercase tracking-[0.2em] text-mist">
                  <tr>{["ID", "Name", "Distance", "Fee", "Payment", "Proof", "Certificate", "Medal", "Actions"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {all.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-mono text-xs text-mist">{p.code}</td>
                      <td className="px-4 py-3"><p className="font-medium">{p.name}</p><p className="text-xs text-mist">{p.city}</p></td>
                      <td className="px-4 py-3 font-display text-xl font-bold">{getDistance(p.distanceId).label}</td>
                      <td className="px-4 py-3">{formatInr(p.amountInr)}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.paymentStatus} /></td>
                      <td className="px-4 py-3"><StatusBadge status={p.proofStatus} /></td>
                      <td className="px-4 py-3 text-mist">{p.certificateIssued ? "Issued" : "-"}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.medalStatus} /></td>
                      <td className="px-4 py-3"><ParticipantActions id={p.id} paymentStatus={p.paymentStatus} medalStatus={p.medalStatus} proofApproved={p.proofStatus === "approved"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
