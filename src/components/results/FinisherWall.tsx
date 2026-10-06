import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { listResults } from "@/lib/repositories/results";
import { getDistance } from "@/data/distances";
import { formatShortDate } from "@/lib/utils";

export async function FinisherWall() {
  const results = await listResults({ perDistance: 2 });
  return (
    <section id="results" aria-labelledby="results-title" className="border-t border-white/10 bg-charcoal py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <header>
            <Eyebrow>Results</Eyebrow>
            <h2 id="results-title" className="mt-5 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight">
              The Finisher <span className="text-accent">Wall</span>
            </h2>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-mist">Verified finishers</p>
          </header>
          <Button href="/results" variant="ghost" className="self-start md:self-auto">View all results</Button>
        </div>

        <div className="mt-12 overflow-hidden border border-white/10">
          <div className="hidden grid-cols-[3rem_1fr_6rem_7rem_6rem_8rem] gap-4 border-b border-white/10 bg-ink/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-mist md:grid" aria-hidden>
            <span>#</span><span>Runner</span><span>Distance</span><span>Time</span><span>Date</span><span className="text-right">Status</span>
          </div>
          {results.length === 0 && <p className="px-6 py-12 text-center text-mist">The first finishers will appear here once runs are verified.</p>}
          <ol>
            {results.map((r, i) => {
              const d = getDistance(r.distanceId);
              return (
                <Reveal as="li" key={r.id} delay={(i % 4) * 60} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 gap-y-1 border-b border-white/10 px-4 py-5 transition-colors last:border-b-0 hover:bg-white/[0.03] sm:px-6 md:grid-cols-[3rem_1fr_6rem_7rem_6rem_8rem]">
                  <span className="font-display text-2xl font-bold text-mist group-hover:text-accent">{String(r.rank).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold">{r.runner.name}</p>
                    <p className="text-xs text-mist">{r.runner.city}</p>
                  </div>
                  <span className="font-display text-2xl font-bold md:text-3xl">
                    <span className="sr-only">Distance </span>{d.label}
                  </span>
                  <span className="col-start-2 font-display text-xl font-semibold tabular-nums md:col-start-auto md:text-3xl">
                    <span className="sr-only">Finish time </span>{r.finishTime}
                  </span>
                  <span className="hidden text-sm text-mist md:block">{formatShortDate(r.date)}</span>
                  <span className="col-start-3 row-start-2 justify-self-end border border-accent/50 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent md:col-start-auto md:row-start-auto">
                    Finisher
                  </span>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
