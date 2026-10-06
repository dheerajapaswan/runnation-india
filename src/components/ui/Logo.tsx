import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="RunNation India home"
      className={`group inline-flex items-baseline gap-2 font-display text-2xl font-extrabold uppercase leading-none tracking-[0.12em] ${className ?? ""}`}
    >
      <span>RunNation</span>
      <span className="text-accent transition-colors group-hover:text-bone">India</span>
    </Link>
  );
}
