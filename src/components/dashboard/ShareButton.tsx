"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/** Uses the native share sheet when available, otherwise copies the link. */
export function ShareButton({ title, text, path }: { title: string; text: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // user dismissed the share sheet, nothing to do
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-12 shrink-0 items-center whitespace-nowrap justify-center gap-2 bg-accent px-7 font-display text-base font-bold uppercase tracking-[0.14em] text-ink shadow-[0_12px_40px_-12px_rgb(255_90_31/0.7)] transition-colors hover:bg-bone"
    >
      {copied ? <Check aria-hidden className="size-4" /> : <Share2 aria-hidden className="size-4" />}
      <span aria-live="polite">{copied ? "Link copied" : "Share now"}</span>
    </button>
  );
}
