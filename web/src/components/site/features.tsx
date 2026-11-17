"use client";

import { useRef } from "react";
import Link from "next/link";
import { TOOL_GROUPS } from "@/lib/tools";
import { motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Building2,
  Calculator,
  FileText,
  History,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

const DOCS = [
  "Proforma Invoice",
  "Commercial Invoice",
  "Packing List",
  "Export Quotation",
  "Export Costing Sheet",
  "Purchase Order",
  "Import Inquiry",
  "Buyer Introduction Letter",
  "Supplier Inquiry Letter",
  "Export Follow-up Letter",
];

// Gold that stays readable on light cards, and brighter gold on dark cards.
const GOLD = "text-[#9a6f1f] dark:text-brass-light";

/** Soft grid and colour glows behind the section. */
function Backdrop() {
  const mask =
    "radial-gradient(ellipse 70% 55% at 50% 48%, black, transparent 78%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,16,32,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,16,32,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div className="absolute -left-40 top-[26%] size-[480px] rounded-full bg-signal/10 blur-3xl" />
      <div className="absolute -right-32 top-[42%] size-[420px] rounded-full bg-brass/15 blur-3xl" />
    </div>
  );
}

/** A card with a soft spotlight that follows the cursor. */
function Spot({
  tone = "light",
  className = "",
  delay = 0,
  children,
}: {
  tone?: "light" | "dark";
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const toneClass =
    tone === "dark"
      ? "dark border-white/10 bg-ink text-foreground shadow-[0_30px_60px_-30px_rgba(11,16,32,0.75)]"
      : "border-border bg-white/80 shadow-[0_24px_48px_-30px_rgba(11,16,32,0.35)] backdrop-blur-sm";

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 ${toneClass} ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(232,185,79,0.16), transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

function CardHead({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div>
      <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light dark:bg-white/10">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 40,
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex w-max gap-2.5"
        animate={
          reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
        }
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="whitespace-nowrap rounded-full border border-border bg-secondary px-4 py-2 text-sm"
          >
            {d}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Marquee() {
  return (
    <div className="mt-auto space-y-3 pt-8">
      <MarqueeRow items={DOCS.slice(0, 5)} duration={32} />
      <MarqueeRow items={DOCS.slice(5)} reverse duration={36} />
    </div>
  );
}

function HsVisual() {
  return (
    <div className="mt-8 space-y-2.5">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3 text-sm">
        <ScanSearch className={`size-4 ${GOLD}`} />
        <span>Cotton knitted T-shirts</span>
        <motion.span
          aria-hidden
          className="ml-0.5 h-4 w-px bg-brass"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-brass/50 bg-brass/10 px-4 py-3">
        <span className={`font-mono text-sm ${GOLD}`}>6109.10</span>
        <span className="flex-1 text-sm">T-shirts, knitted, of cotton</span>
        <span className="text-xs text-muted-foreground">Verify</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Example. Suggestions are guidance, not a legal classification.
      </p>
    </div>
  );
}

function CalcVisual() {
  const rows = [
    ["Product cost", "1,000.00"],
    ["Freight", "120.00"],
    ["Margin", "15%"],
  ];
  return (
    <div className="mt-6 rounded-xl bg-secondary p-4 font-mono text-xs">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between py-1.5">
          <span className="text-muted-foreground">{k}</span>
          <span>{v}</span>
        </div>
      ))}
      <div
        className={`mt-1 flex justify-between border-t border-border pt-2.5 ${GOLD}`}
      >
        <span>Quote price</span>
        <span>1,288.00</span>
      </div>
    </div>
  );
}

function CrmVisual() {
  const rows = [
    ["B", "Buyer", "Send quotation"],
    ["S", "Supplier", "Confirm samples"],
    ["B", "Buyer", "Payment reminder"],
  ];
  return (
    <ul className="mt-6 space-y-2">
      {rows.map(([i, who, task], n) => (
        <li
          key={n}
          className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2.5 text-sm"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-brass-light font-mono text-xs text-ink">
            {i}
          </span>
          <span className="flex-1">{task}</span>
          <span className="text-xs text-muted-foreground">{who}</span>
        </li>
      ))}
    </ul>
  );
}

function ReportVisual() {
  const heights = [34, 52, 40, 68, 58, 84, 72];
  const reduce = useReducedMotion();
  return (
    <div className="mt-6">
      <div className="flex h-28 items-end gap-2 rounded-xl bg-secondary px-4 pb-3 pt-4">
        {heights.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-brass to-brass-light"
            style={{ height: `${h}%` }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Illustration of monthly activity
      </p>
    </div>
  );
}

const SMALL = [
  {
    icon: Building2,
    title: "Your company, saved once",
    text: "Store your details and reuse them on every document.",
  },
  {
    icon: History,
    title: "Document history",
    text: "Drafts, status and past versions in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Each account sees only its own data.",
  },
  {
    icon: Smartphone,
    title: "Works on your phone",
    text: "Create and review documents on any screen.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-paper text-foreground"
    >
      <Backdrop />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
          <span className="size-1.5 rounded-full bg-brass" />
          Features
        </p>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
          Everything a trade desk needs,{" "}
          <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
            in one workspace.
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Documents, classification, costing and follow-ups, built to work
          together instead of living in five different tools.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-6">
          <Spot tone="dark" className="md:col-span-3">
            <CardHead
              icon={FileText}
              title="Document engine"
              text="Twelve export, import and marketing tools, from costing sheets to buyer letters. Save drafts, preview, duplicate, and download print-ready PDFs."
            />
            <Marquee />
          </Spot>

          <Spot className="md:col-span-3" delay={0.1}>
            <CardHead
              icon={ScanSearch}
              title="AI HS Code Finder"
              text="Describe your product and get possible HS codes with the reasoning and guidance on how to verify them."
            />
            <HsVisual />
          </Spot>

          <Spot className="md:col-span-2" delay={0.05}>
            <CardHead
              icon={Calculator}
              title="Trade calculators"
              text="Export costing, landed cost, profit margin, currency and unit conversion."
            />
            <CalcVisual />
          </Spot>

          <Spot tone="dark" className="md:col-span-2" delay={0.15}>
            <CardHead
              icon={Users}
              title="Buyers and suppliers"
              text="Keep contacts, set follow-up reminders and see the history of every interaction."
            />
            <CrmVisual />
          </Spot>

          <Spot className="md:col-span-2" delay={0.25}>
            <CardHead
              icon={BarChart3}
              title="Reports"
              text="Document statistics and monthly activity, drawn from your own records."
            />
            <ReportVisual />
          </Spot>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1.6fr]">
          <Spot tone="dark" delay={0.05}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
              EXIM Marketing
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              Reach buyers and keep the conversation going.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Ready letters to introduce your company and follow up on every
              enquiry.
            </p>
          </Spot>
          {TOOL_GROUPS.filter((g) => g.id === "exim-marketing").map((g) => (
            <div key={g.id} className="grid gap-5 sm:grid-cols-2">
              {g.tools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group rounded-3xl border border-border bg-white/80 p-6 shadow-[0_24px_48px_-34px_rgba(11,16,32,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:bg-white"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light transition-transform duration-300 group-hover:-rotate-6">
                    <t.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold leading-snug">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SMALL.map((s) => (
            <li
              key={s.title}
              className="rounded-2xl border border-border bg-white/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:bg-white"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-brass-light">
                <s.icon className="size-4" />
              </span>
              <h3 className="mt-4 font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
