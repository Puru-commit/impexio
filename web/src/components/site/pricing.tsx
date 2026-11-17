"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

const PAID_FEATURES = [
  "10 document types with print-ready PDF export",
  "AI-assisted HS Code suggestions with reasoning",
  "Trade calculators: costing, landed cost, margin, currency, units",
  "Buyer and supplier records with follow-up reminders",
  "Reports on your documents and activity",
];

export function Pricing() {
  const reduce = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });

  const dots = "radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent 80%)";

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#ece6d6] text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,16,32,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: dots,
          WebkitMaskImage: dots,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 size-[460px] rounded-full bg-brass/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 md:pb-20 md:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
          <span className="size-1.5 rounded-full bg-brass" />
          Pricing
        </p>
        <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
          Simple pricing.{" "}
          <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
            Try it before you pay.
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Create your first document free. If IMPEXIO saves you time, continue
          with one monthly plan.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <motion.div
            {...reveal(0)}
            className="flex flex-col rounded-3xl border border-border bg-white/80 p-8 shadow-[0_24px_48px_-30px_rgba(11,16,32,0.35)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold">Free trial</h3>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-heading text-5xl font-semibold">₹0</span>
            </p>
            <p className="mb-8 mt-3 text-muted-foreground">
              One free document, so you can see how IMPEXIO works before you
              decide.
            </p>
            <Link
              href="/register"
              className="mt-auto rounded-full bg-ink px-6 py-3.5 text-center font-medium text-paper transition-all hover:bg-primary active:scale-[0.98]"
            >
              Start free
            </Link>
          </motion.div>

          <motion.div
            {...reveal(0.12)}
            className="dark relative flex flex-col rounded-3xl border border-brass/50 bg-ink p-8 text-foreground shadow-[0_40px_80px_-30px_rgba(11,16,32,0.7),0_0_80px_-24px_rgba(232,185,79,0.45)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
            >
              <div className="absolute -right-16 -top-16 size-60 rounded-full bg-brass/25 blur-3xl" />
            </div>

            <span className="absolute -top-3 left-8 rounded-full bg-brass-light px-3 py-1 font-mono text-[11px] font-medium text-ink">
              Monthly plan
            </span>
            <h3 className="relative text-xl font-semibold">IMPEXIO</h3>
            <p className="relative mt-6 flex items-baseline gap-2">
              <span className="font-heading text-5xl font-semibold">₹249</span>
              <span className="text-muted-foreground">/ month</span>
            </p>
            <ul className="relative mt-6 space-y-3">
              {PAID_FEATURES.map((f) => (
                <li key={f} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brass-light" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="relative mt-8 rounded-full bg-brass-light px-6 py-3.5 text-center font-medium text-ink transition-all hover:bg-paper active:scale-[0.98]"
            >
              Get started
            </Link>
          </motion.div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          More plans will be added as IMPEXIO grows.
        </p>
      </div>
    </section>
  );
}
