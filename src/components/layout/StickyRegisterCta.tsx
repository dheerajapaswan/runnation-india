"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

/** Mobile/tablet-only register bar, shown after the hero scrolls away. */
export function StickyRegisterCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/85 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      inert={!show}
    >
      <Button href={SITE.registerHref} className="w-full">Register Now</Button>
    </div>
  );
}
