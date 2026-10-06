"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { DISTANCES, getDistance, getPricing } from "@/data/distances";
import { formatInr, cn } from "@/lib/utils";
import Link from "next/link";
import { api } from "@/lib/api";
import { DateField } from "@/components/ui/DateField";
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationInput,
} from "@/lib/registration";
import type { DistanceId } from "@/types";

const EMPTY: RegistrationInput = {
  fullName: "", email: "", mobile: "", city: "", dateOfBirth: "", gender: "",
  distanceId: "10k", address: "", pincode: "", acceptTerms: false,
};

const inputCls = "min-h-12 w-full border bg-transparent px-4 text-base placeholder:text-mist/60 focus:border-accent focus:outline-none";

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-bone/80">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-mist">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-[#ff8a6b]">{error}</p>}
    </div>
  );
}

export function RegistrationForm({ initialDistance }: { initialDistance: DistanceId }) {
  const [v, setV] = useState<RegistrationInput>({ ...EMPTY, distanceId: initialDistance });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const set = <K extends keyof RegistrationInput>(k: K, val: RegistrationInput[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const bind = (k: keyof RegistrationInput) => ({
    id: k,
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
    className: cn(inputCls, errors[k] ? "border-[#ff8a6b]" : "border-white/15"),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateRegistration(v);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setStatus("submitting");
    const res = await api<{ code: string }>("/api/registrations", { method: "POST", json: v });
    if (!res.ok || !res.data) {
      setErrors({ ...(res.fields as RegistrationErrors), ...(res.fields ? {} : { email: res.message }) });
      if (!res.fields && res.message && !/email/i.test(res.message)) setFormError(res.message);
      setStatus("idle");
      return;
    }
    setCode(res.data.code);
    window.dispatchEvent(new Event("rv-auth"));
    setStatus("done");
  };

  const d = getDistance(v.distanceId);
  const price = getPricing(v.distanceId).amountInr;

  if (status === "done") {
    return (
      <div role="status" className="border border-accent/40 bg-accent/5 p-8 sm:p-12">
        <CheckCircle2 aria-hidden className="size-10 text-accent" />
        <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">You&rsquo;re registered</h2>
        <p className="mt-4 text-sm text-mist">Registration ID</p>
        <p className="font-display text-4xl font-bold text-accent">{code}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
          Your {d.name} registration for {formatInr(price)} is saved. Online payment is not live yet, so your payment shows as pending until the team confirms it. Your E-BIB unlocks on your dashboard right after payment.
        </p>
        <Link href="/dashboard" className="mt-8 inline-flex min-h-12 items-center border border-white/20 px-6 font-display text-base font-bold uppercase tracking-[0.14em] hover:border-bone">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-8">
        <fieldset>
          <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">1. Choose your distance</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DISTANCES.map((x) => {
              const on = v.distanceId === x.id;
              return (
                <label key={x.id} className={cn("relative cursor-pointer border p-5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent", on ? "border-accent bg-accent/10" : "border-white/15 hover:border-white/40")}>
                  <input type="radio" name="distance" value={x.id} checked={on} onChange={() => set("distanceId", x.id)} className="sr-only" />
                  <span className="block font-display text-4xl font-extrabold leading-none">{x.label}</span>
                  <span className="mt-1 block min-h-5 text-xs uppercase tracking-widest text-mist">{x.id === "21k" ? "Half Marathon" : ""}</span>
                  <span className="mt-3 block font-display text-2xl font-bold text-accent">{formatInr(getPricing(x.id).amountInr)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">2. Your details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field id="fullName" label="Full name" error={errors.fullName}><input {...bind("fullName")} autoComplete="name" value={v.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field></div>
            <Field id="email" label="Email" error={errors.email}><input {...bind("email")} type="email" autoComplete="email" inputMode="email" value={v.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field id="mobile" label="Mobile" error={errors.mobile} hint="10-digit number"><input {...bind("mobile")} type="tel" autoComplete="tel-national" inputMode="numeric" maxLength={10} value={v.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} /></Field>
            <div className="sm:col-span-2"><Field id="dateOfBirth" label="Date of birth" error={errors.dateOfBirth}><DateField id="dateOfBirth" minYear={1930} maxYear={new Date().getFullYear() - 5} invalid={!!errors.dateOfBirth} describedBy={errors.dateOfBirth ? "dateOfBirth-err" : undefined} onChange={(iso) => set("dateOfBirth", iso)} /></Field></div>
            <Field id="gender" label="Gender" error={errors.gender}>
              <select {...bind("gender")} value={v.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="" className="bg-ink">Select</option>
                <option className="bg-ink">Female</option><option className="bg-ink">Male</option><option className="bg-ink">Non-binary</option><option className="bg-ink">Prefer not to say</option>
              </select>
            </Field>
            <Field id="city" label="City" error={errors.city}><input {...bind("city")} autoComplete="address-level2" value={v.city} onChange={(e) => set("city", e.target.value)} /></Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">3. Medal delivery</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field id="address" label="Delivery address" error={errors.address}><textarea {...bind("address")} rows={3} autoComplete="street-address" value={v.address} onChange={(e) => set("address", e.target.value)} className={cn(inputCls, "py-3", errors.address ? "border-[#ff8a6b]" : "border-white/15")} /></Field></div>
            <Field id="pincode" label="PIN code" error={errors.pincode}><input {...bind("pincode")} autoComplete="postal-code" inputMode="numeric" maxLength={6} value={v.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} /></Field>
          </div>
        </fieldset>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-bone/85">
            <input id="acceptTerms" type="checkbox" checked={v.acceptTerms} onChange={(e) => set("acceptTerms", e.target.checked)} aria-invalid={!!errors.acceptTerms} aria-describedby={errors.acceptTerms ? "acceptTerms-err" : undefined} className="mt-1 size-5 shrink-0 accent-[#ff5a1f]" />
            I agree to the Terms &amp; Conditions and Refund Policy, and confirm I am fit to run my chosen distance.
          </label>
          {errors.acceptTerms && <p id="acceptTerms-err" role="alert" className="mt-1.5 text-xs text-[#ff8a6b]">{errors.acceptTerms}</p>}
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="border border-white/10 bg-charcoal p-6 sm:p-8 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Summary</p>
          <p className="mt-4 font-display text-4xl font-extrabold uppercase leading-none">{d.name}</p>
          <p className="mt-1 text-sm text-mist">RunNation Virtual Run 2026</p>
          <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm text-bone/85">
            {getPricing(v.distanceId).inclusions.map((i) => <li key={i}>{i}</li>)}
          </ul>
          <p className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-5">
            <span className="text-xs uppercase tracking-[0.2em] text-mist">Total</span>
            <span className="font-display text-4xl font-bold">{formatInr(price)}</span>
          </p>
          <button type="submit" disabled={status === "submitting"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-accent font-display text-lg font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-bone disabled:opacity-60">
            {status === "submitting" ? <><Loader2 aria-hidden className="size-4 animate-spin" />Submitting</> : "Continue"}
          </button>
          {formError && <p role="alert" className="mt-3 text-xs text-[#ff8a6b]">{formError}</p>}
          <p className="mt-3 text-xs text-mist">Online payment is not live yet. Your payment stays pending until confirmed by the team.</p>
        </div>
      </aside>
    </form>
  );
}
