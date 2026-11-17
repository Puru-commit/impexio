"use client";

import { useRef } from "react";
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

/** A card with a soft brass spotlight that follows the cursor. */
function Spot({
  className = "",
  delay = 0,
  children,
}: {
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

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors hover:border-brass/40 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(232,185,79,0.14), transparent 60%)",
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
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-brass-light">
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
        <ScanSearch className="size-4 text-brass-light" />
        <span>Cotton knitted T-shirts</span>
        <motion.span
          aria-hidden
          className="ml-0.5 h-4 w-px bg-brass-light"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-brass/50 bg-brass/10 px-4 py-3">
        <span className="font-mono text-sm text-brass-light">6109.10</span>
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
      <div className="mt-1 flex justify-between border-t border-border pt-2.5 text-brass-light">
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
          <span className="flex size-7 items-center justify-center rounded-full bg-ink font-mono text-xs text-brass-light">
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
      className="dark border-t border-border bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
          Features
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
          Everything a trade desk needs, in one workspace.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Documents, classification, costing and follow-ups, built to work
          together instead of living in five different tools.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-6">
          <Spot className="md:col-span-3">
            <CardHead
              icon={FileText}
              title="Document engine"
              text="Ten document types from invoices to follow-up letters. Save drafts, preview, duplicate, and download print-ready PDFs."
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

          <Spot className="md:col-span-2" delay={0.15}>
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

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SMALL.map((s) => (
            <li
              key={s.title}
              className="rounded-2xl border border-border p-5 transition-colors hover:border-brass/40"
            >
              <s.icon className="size-5 text-brass-light" />
              <h3 className="mt-4 font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}