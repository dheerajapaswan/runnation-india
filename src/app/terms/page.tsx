import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="The rules that apply when you register for a RunNation India event."
      sections={[
        { heading: "Eligibility and fitness", body: ["You confirm you are medically fit to run your chosen distance and take part at your own risk. Consult a doctor if unsure."] },
        { heading: "Completing the run", body: ["Complete your registered distance outdoors during the event window and record it with a GPS app or watch. Proof must show distance, time, date and route."] },
        { heading: "Verification", body: ["Medals and certificates are issued only after proof is verified. Altered, duplicated or ineligible proof will be rejected."] },
        { heading: "Distances", body: ["Our categories are 3K, 5K, 10K and 21.1K Half Marathon."] },
        { heading: "Safety", body: ["Follow local laws and traffic rules. RunNation India is not liable for injury or loss arising from your participation."] },
        { heading: "Changes", body: ["We may update event details and these terms. Material changes will be communicated by email."] },
      ]}
    />
  );
}
