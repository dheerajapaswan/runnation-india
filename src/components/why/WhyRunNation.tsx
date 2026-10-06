import { BadgeCheck, Check, Route, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

function Tile({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className={cn("group relative overflow-hidden border border-white/10 bg-charcoal p-7 transition-colors duration-500 hover:border-white/30 sm:p-9", className)}>
      {children}
    </Reveal>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-accent">{children}</h3>
);

export function WhyRunNation() {
  return (
    <section id="why" aria-labelledby="why-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="why-title"
          eyebrow="Why RunNation"
          title={<>Built for runners, <span className="text-accent">not for noise.</span></>}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6 lg:grid-cols-12">
          {/* Run Anywhere */}
          <Tile className="md:col-span-6 lg:col-span-7 lg:row-span-2 min-h-[22rem]">
            <Label>Run Anywhere</Label>
            <p aria-hidden className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[clamp(7rem,20vw,16rem)] font-extrabold leading-none text-outline transition-colors duration-700 group-hover:text-accent/40">
              ∞
            </p>
            <p className="relative mt-5 max-w-md font-display text-4xl font-bold uppercase leading-[0.95] sm:text-6xl">
              Your road is the <span className="text-accent">start line.</span>
            </p>
            <p className="relative mt-5 max-w-sm text-sm leading-relaxed text-mist">
              Park, promenade or hill climb. Run where you live, on the day that suits you.
            </p>
          </Tile>

          {/* Verified */}
          <Tile className="md:col-span-3 lg:col-span-5" delay={80}>
            <Label>Verified Results</Label>
            <div className="mt-6 flex items-center gap-4">
              <BadgeCheck aria-hidden className="size-12 text-accent" strokeWidth={1.25} />
              <p className="font-display text-3xl font-bold uppercase leading-none">Every finish<br />checked.</p>
            </div>
          </Tile>

          {/* Certificate */}
          <Tile className="md:col-span-3 lg:col-span-5" delay={120}>
            <Label>Digital Certificate</Label>
            <div className="mt-5 border border-white/15 bg-ink p-4 transition-transform duration-500 group-hover:-rotate-1">
              <p className="text-[9px] uppercase tracking-[0.3em] text-mist">Certificate of completion</p>
              <p className="mt-2 font-display text-2xl font-bold uppercase leading-none">Your Name</p>
              <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-2 text-[10px] uppercase tracking-widest text-mist">
                <span>10K · 45:20</span>
                <span className="font-display text-sm text-accent">RunNation</span>
              </div>
            </div>
          </Tile>

          {/* Premium medal */}
          <Tile className="md:col-span-3 lg:col-span-4" delay={80}>
            <Label>Premium Medal</Label>
            <p className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.9]">
              Heavy.<br /><span className="text-accent">Real.</span><br />Yours.
            </p>
          </Tile>

          {/* Distances */}
          <Tile className="md:col-span-3 lg:col-span-4" delay={120}>
            <Label>Multiple Distances</Label>
            <div className="mt-6 space-y-3" aria-hidden>
              {[["3K", "14%"], ["5K", "24%"], ["10K", "48%"], ["21.1K", "100%"]].map(([l, w]) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="w-12 font-display text-xl font-bold">{l}</span>
                  <span className="h-1.5 flex-1 bg-white/10">
                    <span className="block h-full bg-accent transition-all duration-700 group-hover:brightness-125" style={{ width: w }} />
                  </span>
                </div>
              ))}
            </div>
            <p className="sr-only">3K, 5K, 10K and 21.1K Half Marathon</p>
          </Tile>

          {/* Simple registration */}
          <Tile className="md:col-span-3 lg:col-span-4" delay={160}>
            <Label>Simple Registration</Label>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              <span className="block font-display text-4xl font-bold uppercase leading-none text-bone">Pick. Pay. Run.</span>
              <span className="mt-3 block">No clutter and no confusing forms.</span>
            </p>
          </Tile>

          {/* Community */}
          <Tile className="md:col-span-3 lg:col-span-6" delay={80}>
            <Label>Runner Community</Label>
            <div className="mt-5 flex items-center gap-5">
              <Users aria-hidden className="size-10 shrink-0 text-accent" strokeWidth={1.25} />
              <p className="text-sm leading-relaxed text-mist">
                Run alone, finish together. Every approved runner earns a place on the Finisher Wall.
              </p>
            </div>
          </Tile>

          {/* Transparent */}
          <Tile className="md:col-span-3 lg:col-span-6" delay={120}>
            <Label>Transparent Process</Label>
            <ul className="mt-5 grid gap-2 text-sm text-bone/85 sm:grid-cols-2">
              {["Clear rules upfront", "Visible verification status", "Published timelines", "Fair, consistent checks"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check aria-hidden className="size-4 text-accent" />{t}</li>
              ))}
            </ul>
            <Route aria-hidden className="absolute -bottom-3 -right-3 size-20 text-white/5" strokeWidth={1} />
          </Tile>
        </div>
      </Container>
    </section>
  );
}
