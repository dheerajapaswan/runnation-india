import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatInr, cn } from "@/lib/utils";
import { SITE } from "@/data/site";
import type { Distance, Pricing } from "@/types";

export function PricingCard({ distance, pricing }: { distance: Distance; pricing: Pricing }) {
  const isHalf = distance.id === "21k";
  const featured = distance.featured;

  return (
    <article
      aria-labelledby={`price-${distance.id}`}
      className={cn(
        "group relative flex h-full flex-col border p-7 transition-all duration-500 sm:p-9",
        featured
          ? "border-accent/60 bg-gradient-to-b from-accent/[0.08] to-charcoal"
          : "border-white/10 bg-charcoal hover:border-white/30",
      )}
    >
      {featured && (
        <span className="absolute right-0 top-0 bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
          Most popular
        </span>
      )}

      <h3 id={`price-${distance.id}`} className="font-display font-extrabold uppercase leading-none">
        <span className="block text-[clamp(4.5rem,7vw,5.5rem)] tracking-tight">
          {distance.label.replace("K", "")}
          <span className="text-accent">K</span>
        </span>
        <span aria-hidden className="mt-2 block h-8 whitespace-nowrap text-xl tracking-[0.1em]">{isHalf ? "Half Marathon" : ""}</span>
        <span className="sr-only">{distance.name}</span>
      </h3>

      <p className="mt-5 min-h-[3.5rem] text-sm leading-relaxed text-mist">{distance.summary}</p>

      <p className="mt-6 flex items-baseline gap-2 border-t border-white/10 pt-6">
        <span className="font-display text-5xl font-bold">{formatInr(pricing.amountInr)}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-mist">per runner</span>
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {pricing.inclusions.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm">
            <Check aria-hidden className="size-4 shrink-0 text-accent" />
            {item}
          </li>
        ))}
      </ul>

      <Button
        href={`${SITE.registerHref}?distance=${distance.id}`}
        variant={featured ? "primary" : "ghost"}
        className="mt-9 w-full !px-4 whitespace-nowrap"
      >
        Register {distance.label}
      </Button>
    </article>
  );
}
