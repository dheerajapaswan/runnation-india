import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_LINKS, SITE } from "@/data/site";

const SOCIALS = [
  {
    label: "Instagram",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  },
  { label: "Facebook", path: "M14 8V6a1 1 0 0 1 1-1h2V2h-3a4 4 0 0 0-4 4v2H7v3h3v10h4V11h3l1-3Z" },
  { label: "YouTube", path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5 3-5 3Z" },
  { label: "X", path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pb-28 pt-16 lg:pb-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Logo className="!text-3xl" />
            <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.16em] text-mist">{SITE.tagline}</p>
            <ul className="mt-8 flex gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href="#" aria-label={`${s.label} (coming soon)`} className="grid size-11 place-items-center border border-white/15 text-bone/80 transition-colors hover:border-accent hover:text-accent">
                    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current"><path d={s.path} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-accent">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-bone/70 transition-colors hover:text-bone">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-mist sm:flex-row">
          <p>&copy; {new Date().getFullYear()} RunNation India. All rights reserved.</p>
          <p>Made for runners, everywhere.</p>
        </div>
      </Container>
    </footer>
  );
}
