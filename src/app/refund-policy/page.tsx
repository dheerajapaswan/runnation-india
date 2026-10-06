import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Refund Policy", alternates: { canonical: "/refund-policy" } };

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      intro="When refunds and distance changes apply."
      sections={[
        { heading: "General rule", body: ["Confirmed registrations are non-refundable, as costs such as medals are committed once you register."] },
        { heading: "Cancelled events", body: ["If we cancel the event, registered participants will receive a full refund to the original payment method."] },
        { heading: "Duplicate or failed payments", body: ["If you are charged twice or charged without a confirmed registration, contact us and we will refund the extra amount."] },
        { heading: "Distance changes", body: ["Distance changes before the event window opens are subject to the price difference between categories."] },
        { heading: "How to ask", body: ["Email hello@runverse.in with your registration details."] },
      ]}
    />
  );
}
