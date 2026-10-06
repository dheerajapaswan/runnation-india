import type { Distance, DistanceId, Pricing } from "@/types";

export const DISTANCES: Distance[] = [
  {
    id: "3k",
    label: "3K",
    name: "3K",
    kilometres: 3,
    summary: "A welcoming first step. Short, easy and open to every runner and walker.",
  },
  {
    id: "5k",
    label: "5K",
    name: "5K",
    kilometres: 5,
    summary: "The perfect first finish. Fast, focused and open to every pace.",
  },
  {
    id: "10k",
    label: "10K",
    name: "10K",
    kilometres: 10,
    summary: "The sweet spot of distance and challenge for regular runners.",
    featured: true,
  },
  {
    id: "21k",
    label: "21.1K",
    name: "21.1K Half Marathon",
    kilometres: 21.1,
    summary: "The full test of endurance. Built for runners chasing a statement finish.",
  },
];

const SHARED = ["Finisher medal", "E-BIB", "E-certificate", "Finisher recognition"];

/** Single source of truth for prices. Replace with a DB query later. */
export const PRICING: Pricing[] = [
  { distanceId: "3k", amountInr: 399, currency: "INR", inclusions: SHARED },
  { distanceId: "5k", amountInr: 449, currency: "INR", inclusions: SHARED },
  { distanceId: "10k", amountInr: 499, currency: "INR", inclusions: SHARED },
  { distanceId: "21k", amountInr: 549, currency: "INR", inclusions: SHARED },
];

export function getDistance(id: DistanceId): Distance {
  const d = DISTANCES.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown distance: ${id}`);
  return d;
}

export function getPricing(id: DistanceId): Pricing {
  const p = PRICING.find((x) => x.distanceId === id);
  if (!p) throw new Error(`No pricing for distance: ${id}`);
  return p;
}
