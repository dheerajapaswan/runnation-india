import { cn } from "@/lib/utils";

const TONE = {
  good: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  warn: "border-accent/50 bg-accent/10 text-accent",
  bad: "border-red-400/40 bg-red-400/10 text-red-300",
  idle: "border-white/20 bg-white/5 text-mist",
} as const;

const MAP: Record<string, keyof typeof TONE> = {
  paid: "good", approved: "good", delivered: "good", dispatched: "good",
  pending: "warn", submitted: "warn", packed: "warn", shipped: "warn",
  failed: "bad", rejected: "bad", refunded: "bad",
  not_submitted: "idle", not_ready: "idle",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-block whitespace-nowrap border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]", TONE[MAP[status] ?? "idle"])}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
