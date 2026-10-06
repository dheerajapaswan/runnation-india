"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-5xl font-extrabold uppercase">Something went wrong</h1>
        <p className="mt-3 text-mist">Please try again.</p>
        <button type="button" onClick={reset} className="mt-8 min-h-12 bg-accent px-8 font-display text-base font-bold uppercase tracking-[0.14em] text-ink hover:bg-bone">
          Try again
        </button>
      </div>
    </section>
  );
}
