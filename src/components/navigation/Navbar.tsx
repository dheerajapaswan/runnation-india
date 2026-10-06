"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export const AUTH_EVENT = "rv-auth";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<{ name: string } | null | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const res = await api<{ name: string } | null>("/api/participant/me");
      if (!cancelled) setUser(res.ok ? (res.data ?? null) : null);
    };
    check();
    window.addEventListener(AUTH_EVENT, check);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_EVENT, check);
    };
  }, [pathname]);

  const logout = async () => {
    await api("/api/participant/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.replace("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled || open
          ? "border-white/10 bg-ink/80 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:h-[72px] lg:px-12">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="relative py-2 text-sm font-medium text-bone/70 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-bone hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden min-h-10 items-center gap-3 lg:flex">
            {user === undefined ? null : user ? (
              <>
                <button type="button" onClick={logout} className="inline-flex min-h-10 items-center justify-center bg-accent px-5 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink shadow-[0_0_0_1px_rgb(255_90_31/0.6),0_12px_40px_-12px_rgb(255_90_31/0.7)] transition-all duration-300 hover:bg-bone active:scale-[0.98]">
                  Logout
                </button>
                <Button href="/dashboard" className="!min-h-10 !px-5 !text-sm" arrow={false}>
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button href={SITE.loginHref} className="!min-h-10 !px-5 !text-sm" arrow={false}>
                  Login
                </Button>
                <Button href={SITE.registerHref} className="!min-h-10 !px-5 !text-sm" arrow={false}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-white/15 text-bone transition-colors hover:border-accent lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink/95 px-5 pb-10 pt-6 sm:px-8 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((l, i) => (
              <li key={l.label} className="border-b border-white/10">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-center justify-between font-display text-4xl font-bold uppercase tracking-wide"
                >
                  {l.label}
                  <span className="text-sm font-medium text-accent">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-3">
          {user ? (
            <>
              <Button href="/dashboard" size="lg" className="w-full" onClick={() => setOpen(false)}>
                Dashboard
              </Button>
              <button type="button" onClick={logout} className="min-h-14 w-full bg-accent font-display text-lg font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-bone">
                Logout
              </button>
            </>
          ) : (
            <>
              <Button href={SITE.registerHref} size="lg" className="w-full" onClick={() => setOpen(false)}>
                Sign Up
              </Button>
              <Button href={SITE.loginHref} size="lg" arrow={false} className="w-full" onClick={() => setOpen(false)}>
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
