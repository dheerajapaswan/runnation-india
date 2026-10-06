/**
 * Domain types. Shapes are intentionally flat and serialisable so each
 * maps cleanly onto a future Supabase/PostgreSQL table.
 */

export type DistanceId = "3k" | "5k" | "10k" | "21k";

export type RegistrationStatus = "opening-soon" | "open" | "closed";

export interface Distance {
  id: DistanceId;
  /** Short label, e.g. "21.1K" */
  label: string;
  /** Full public name. 21.1K must always read "21.1K Half Marathon". */
  name: string;
  kilometres: number;
  summary: string;
  featured?: boolean;
}

export interface Pricing {
  distanceId: DistanceId;
  /** Whole rupees. */
  amountInr: number;
  currency: "INR";
  inclusions: string[];
}

export interface RaceEvent {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  registrationStatus: RegistrationStatus;
  /** ISO dates; null while the window is unannounced. */
  windowStart: string | null;
  windowEnd: string | null;
  dateLabel: string;
  format: string;
  distanceIds: DistanceId[];
  perks: string[];
}

export interface Runner {
  id: string;
  name: string;
  city: string;
}

export type ResultStatus = "finisher" | "pending";

export interface Result {
  id: string;
  runner: Runner;
  distanceId: DistanceId;
  /** H:MM:SS or MM:SS */
  finishTime: string;
  /** ISO date */
  date: string;
  status: ResultStatus;
  /** 1-based position within its distance, by finish time. */
  rank: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export type MedalStatus = "not_ready" | "packed" | "shipped" | "delivered";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ProofStatus = "not_submitted" | "submitted" | "approved" | "rejected";

/** A registration joined with its payment, proof and fulfilment state. */
export interface Participant {
  id: string;
  /** Registration ID, e.g. RV26-A1B2C3 */
  code: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  distanceId: DistanceId;
  amountInr: number;
  paymentStatus: PaymentStatus;
  proofStatus: ProofStatus;
  proofId?: string;
  /** One-line summary of the automatic proof analysis. */
  analysisNote?: string;
  finishTime?: string;
  runDate?: string;
  proofApp?: string;
  certificateIssued: boolean;
  bibNumber?: number;
  medalStatus: MedalStatus;
  registeredAt: string;
}
