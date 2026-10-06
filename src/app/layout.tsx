import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { SITE } from "@/data/site";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyRegisterCta } from "@/components/layout/StickyRegisterCta";
import "@/styles/globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | RunNation India" },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["virtual run India", "virtual marathon", "3K", "5K", "10K", "21.1K Half Marathon", "finisher medal", "e-certificate", "e-BIB"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-ink text-bone antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <StickyRegisterCta />
      </body>
    </html>
  );
}
