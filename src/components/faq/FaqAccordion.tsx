"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { FAQ } from "@/types";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = items.length - 1;
    const target =
      e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                ref={(el) => { buttons.current[i] = el; }}
                type="button"
                id={`faq-btn-${item.id}`}
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className={cn("font-display text-2xl font-bold uppercase tracking-wide transition-colors sm:text-3xl", open ? "text-accent" : "group-hover:text-accent")}>
                  {item.question}
                </span>
                <Plus aria-hidden className={cn("size-6 shrink-0 text-accent transition-transform duration-300", open && "rotate-45")} />
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-btn-${item.id}`}
              className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-base leading-relaxed text-mist" inert={!open}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
