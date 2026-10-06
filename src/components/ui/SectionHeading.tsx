import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent", className)}>
      <span aria-hidden className="h-px w-8 bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="mt-5 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-balance"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{description}</p>
      )}
    </header>
  );
}
