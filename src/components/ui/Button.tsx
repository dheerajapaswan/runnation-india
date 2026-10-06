import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "light";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-ink hover:bg-bone shadow-[0_0_0_1px_rgb(255_90_31/0.6),0_12px_40px_-12px_rgb(255_90_31/0.7)]",
  ghost: "border border-white/20 text-bone hover:border-bone hover:bg-white/5",
  light: "bg-bone text-ink hover:bg-accent",
};

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  size?: "md" | "lg";
  onClick?: () => void;
}

export function Button({
  href,
  children,
  variant = "primary",
  arrow = true,
  size = "md",
  className,
  onClick,
}: ButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center justify-center gap-3 font-display font-bold uppercase tracking-[0.14em] transition-all duration-300 active:scale-[0.98]",
        size === "lg" ? "min-h-14 px-9 text-lg" : "min-h-12 px-7 text-base",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
