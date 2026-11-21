"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { registerAction } from "@/app/register/actions";
import { BUSINESS_TYPES, TRADE_TYPES } from "@/lib/signup-options";
import { GoogleG } from "./google-g";

const input = "h-12 w-full rounded-xl border border-border bg-paper px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-brass focus:ring-4 focus:ring-brass/15";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { error: "" });
  const [trade, setTrade] = useState("");
  const [biz, setBiz] = useState("");
  const chip = (on: boolean) => `cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : "border-border bg-white hover:border-brass"}`;

  return (
    <form action={action} className="mt-6 rounded-3xl border border-border bg-white/90 p-7 shadow-[0_40px_80px_-40px_rgba(11,16,32,0.5)] backdrop-blur-sm md:p-8">
      <h1 className="text-center text-2xl font-semibold md:text-3xl">Create your account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Your first document is free. No card needed.</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Full name
          <input name="fullName" required autoComplete="name" placeholder="Your name" className={`${input} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium">Business name
          <input name="companyName" required autoComplete="organization" placeholder="Company or firm" className={`${input} mt-1.5`} />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">I am an</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRADE_TYPES.map((t) => (
            <label key={t} className={chip(trade === t)}><input type="radio" name="tradeType" value={t} required checked={trade === t} onChange={() => setTrade(t)} className="sr-only" />{t}</label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Business type</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUSINESS_TYPES.map((t) => (
            <label key={t} className={chip(biz === t)}><input type="radio" name="businessType" value={t} required checked={biz === t} onChange={() => setBiz(t)} className="sr-only" />{t}</label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Main product <span className="font-normal text-muted-foreground">(optional)</span>
          <input name="mainProduct" placeholder="e.g. Turmeric, garments" className={`${input} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium">Phone <span className="font-normal text-muted-foreground">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+91 …" className={`${input} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">IEC code <span className="font-normal text-muted-foreground">(optional, add it later if you do not have it)</span>
          <input name="iecCode" placeholder="Importer-Exporter Code" className={`${input} mt-1.5 uppercase`} />
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="agree" className="mt-1 size-4 accent-[#0b1020]" />
        <span>I agree to the <Link href="/terms" className="text-foreground underline underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-foreground underline underline-offset-4">Privacy Policy</Link>.</span>
      </label>

      {state.error && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-vermilion/40 bg-vermilion/10 p-3 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" />{state.error}</p>
      )}

      <button type="submit" disabled={pending} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-all hover:bg-primary active:scale-[0.98] disabled:opacity-60">
        <span className="flex size-6 items-center justify-center rounded-full bg-white"><GoogleG /></span>
        {pending ? "Opening Google…" : "Continue with Google"}
      </button>
      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-[#9a6f1f]" />We never see your Google password.</p>
    </form>
  );
}
