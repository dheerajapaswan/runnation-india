import { CalendarDays, Award, FileBadge2, MapPinned, Ticket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { UPCOMING_EVENT } from "@/data/event";
import { getDistance } from "@/data/distances";
import type { RegistrationStatus } from "@/types";

const STATUS: Record<RegistrationStatus, string> = {
  "opening-soon": "Opening soon",
  open: "Registration open",
  closed: "Registration closed",
};

export function UpcomingEvent() {
  const e = UPCOMING_EVENT;
  const perks = [
    { icon: Award, label: "Finisher Medal" },
    { icon: FileBadge2, label: "E-Certificate" },
    { icon: Ticket, label: "E-BIB" },
    { icon: MapPinned, label: "Run Anywhere format" },
  ];

  return (
    <section id="event" aria-labelledby="event-title" className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden border border-white/10 bg-charcoal">
            <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/15 blur-[100px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-10 right-4 select-none font-display text-[clamp(8rem,28vw,22rem)] font-extrabold leading-none text-outline">
              2026
            </div>

            <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-12 lg:p-16">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-4">
                  <Eyebrow>Upcoming event</Eyebrow>
                  <span className="inline-flex items-center gap-2 border border-accent/50 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                    {STATUS[e.registrationStatus]}
                  </span>
                </div>
                <h2 id="event-title" className="mt-6 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-balance">
                  RunNation <span className="text-accent">Virtual Run</span> 2026
                </h2>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-mist sm:text-lg">{e.tagline}</p>

                <p className="mt-8 flex items-center gap-3 text-sm font-medium text-bone">
                  <CalendarDays aria-hidden className="size-5 text-accent" />
                  {e.dateLabel}
                </p>

                <div className="mt-10">
                  <Button href="/events">View Event</Button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">Choose your distance</p>
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {e.distanceIds.map((id) => {
                    const d = getDistance(id);
                    return (
                      <li key={id} className="flex items-baseline justify-between gap-4 py-4">
                        <span className="font-display text-4xl font-bold leading-none sm:text-5xl">{d.label}</span>
                        <span className="text-sm text-mist">{id === "21k" ? "Half Marathon" : "Virtual"}</span>
                      </li>
                    );
                  })}
                </ul>
                <ul className="mt-6 grid gap-3">
                  {perks.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-sm text-bone/85">
                      <Icon aria-hidden className="size-4 text-accent" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
