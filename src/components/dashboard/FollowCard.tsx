import { ExternalLink } from "lucide-react";

export function FollowCard({ icon, title, body, href, cta, tone }: { icon: React.ReactNode; title: string; body: string; href: string | null; cta: string; tone: string }) {
  return (
    <div className="flex flex-col gap-5 border border-white/10 bg-charcoal p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-5">
        <span className={`grid size-14 shrink-0 place-items-center text-white ${tone}`}>{icon}</span>
        <div>
          <h3 className="font-display text-2xl font-bold uppercase sm:text-3xl">{title}</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-mist">{body}</p>
        </div>
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-2 px-7 font-display text-base font-bold uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-0.5 ${tone}`}>
          {cta} <ExternalLink aria-hidden className="size-4" />
        </a>
      ) : (
        <span aria-disabled="true" className="inline-flex min-h-12 shrink-0 items-center justify-center border border-white/15 px-7 font-display text-base font-bold uppercase tracking-[0.14em] text-mist">Coming soon</span>
      )}
    </div>
  );
}
