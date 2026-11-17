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

  return (
    <section
      id="pricing"
      className="dark border-t border-border bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
          Pricing
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
          Simple pricing. Try it before you pay.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Create your first document free. If IMPEXIO saves you time, continue
          with one monthly plan.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <motion.div
            {...reveal(0)}
            className="flex flex-col rounded-3xl border border-border bg-card p-8"
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
              className="mt-auto rounded-full border border-border px-6 py-3.5 text-center font-medium transition-colors hover:bg-secondary"
            >
              Start free
            </Link>
          </motion.div>

          <motion.div
            {...reveal(0.12)}
            className="relative flex flex-col rounded-3xl border border-brass/60 bg-card p-8 shadow-[0_0_80px_-20px_rgba(232,185,79,0.35)]"
          >
            <span className="absolute -top-3 left-8 rounded-full bg-brass-light px-3 py-1 font-mono text-[11px] font-medium text-ink">
              Monthly plan
            </span>
            <h3 className="text-xl font-semibold">IMPEXIO</h3>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-heading text-5xl font-semibold">₹249</span>
              <span className="text-muted-foreground">/ month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {PAID_FEATURES.map((f) => (
                <li key={f} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brass-light" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 rounded-full bg-brass-light px-6 py-3.5 text-center font-medium text-ink transition-colors hover:bg-paper"
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