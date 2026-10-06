import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How RunNation India collects, uses and protects your information."
      sections={[
        { heading: "Information we collect", body: ["Registration details such as name, email, mobile number, date of birth, gender, city and delivery address, plus the run proof you upload and your payment status."] },
        { heading: "How we use it", body: ["To register you, verify your run, issue your E-BIB and certificate, dispatch your medal and send event updates by email or WhatsApp."] },
        { heading: "Payments", body: ["Payments are processed by our payment partner. We do not store your card or UPI credentials."] },
        { heading: "Sharing", body: ["We share data only with service providers needed to run the event, such as payment, delivery and messaging partners. We do not sell personal data."] },
        { heading: "Public results", body: ["Your name, distance and finish time may appear on the public Finisher Wall once your run is verified."] },
        { heading: "Your rights", body: ["You may request access, correction or deletion of your data by contacting us at hello@runverse.in."] },
      ]}
    />
  );
}
