import type { NavLink } from "@/types";

export const SITE = {
  name: "RunNation India",
  tagline: "RUN ANYWHERE. FINISH WITH GLORY.",
  title: "RunNation India | Premium Virtual Running Events",
  description:
    "Run anywhere, complete your distance and earn your finisher medal with RunNation India. Choose 3K, 5K, 10K or 21.1K virtual running events.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Swap for a real asset path (e.g. "/images/hero.jpg") when photography is ready. */
  heroImage: null as string | null,
  medalImage: null as string | null,
  /** Set real profile URLs to enable the "Follow now" buttons on the dashboard. */
  social: {
    instagram: null as string | null,
    whatsapp: null as string | null,
  },
  registerHref: "/register",
  loginHref: "/dashboard/login",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Results", href: "/results" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_LINKS: { title: string; links: NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Results", href: "/results" },
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];
