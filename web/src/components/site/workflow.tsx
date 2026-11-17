"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { BellRing, FileText, PackageSearch, ScanSearch } from "lucide-react";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

function CardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Tag>Example</Tag>
      </div>
      {children}
    </div>
  );
}

function DescribeCard() {
  const rows = [
    ["Product", "Cotton knitted T-shirts"],
    ["Material", "100% cotton, 180 GSM"],
    ["Intended use", "Apparel, retail"],
    ["Destination", "United States"],
  ];
  return (
    <CardShell title="Describe your product">
      <dl className="space-y-2.5">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-4 rounded-lg bg-secondary px-3.5 py-2.5 text-sm"
          >
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </CardShell>
  );
}

function ClassifyCard() {
  const rows = [
    ["6109.10", "T-shirts, knitted, of cotton", "Best match"],
    ["6109.90", "T-shirts, knitted, other materials", "Possible"],
    ["6110.20", "Jerseys, pullovers, of cotton", "Possible"],
  ];
  return (
    <CardShell title="HS Code suggestions">
      <ul className="space-y-2.5">
        {rows.map(([code, desc, tag], i) => (
          <li
            key={code}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 ${
              i === 0 ? "border border-brass/50 bg-brass/10" : "bg-secondary"
            }`}
          >
            <span className="font-mono text-sm text-brass-light">{code}</span>
            <span className="flex-1 text-sm">{desc}</span>
            <span className="text-xs text-muted-foreground">{tag}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        AI suggestions only. Always verify the final code with your customs
        broker or the official tariff.
      </p>
    </CardShell>
  );
}

function DocumentCard() {
  return (
    <CardShell title="Proforma Invoice · PI-0001">
      <div className="rounded-lg bg-secondary p-4 font-mono text-xs">
        <div className="flex justify-between border-b border-border pb-2 text-muted-foreground">
          <span>Item</span>
          <span>Qty × Rate</span>
          <span>Amount</span>
        </div>
        <div className="flex justify-between py-2.5">
          <span>T-shirts</span>
          <span>500 × 3.20</span>
          <span>1,600.00</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2.5 text-brass-light">
          <span>Total (USD)</span>
          <span>1,600.00</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Tag>Draft</Tag>
        <Tag>PDF ready</Tag>
      </div>
    </CardShell>
  );
}

function FollowUpCard() {
  const rows = [
    ["Send quotation reminder", "Tomorrow"],
    ["Confirm shipment details", "In 3 days"],
    ["Request payment update", "Next week"],
  ];
  return (
    <CardShell title="Follow-ups">
      <ul className="space-y-2.5">
        {rows.map(([task, when]) => (
          <li
            key={task}
            className="flex items-center justify-between rounded-lg bg-secondary px-3.5 py-2.5 text-sm"
          >
            <span>{task}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {when}
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

const STEPS = [
  {
    icon: PackageSearch,
    title: "Describe what you ship",
    text: "Start with the product: name, material, intended use and destination. IMPEXIO keeps it with the shipment so you never type it twice.",
    visual: <DescribeCard />,
  },
  {
    icon: ScanSearch,
    title: "Classify with AI assistance",
    text: "Get possible HS codes with the reasoning behind each one. They are suggestions to check, not legal classifications, and every result says so.",
    visual: <ClassifyCard />,
  },
  {
    icon: FileText,
    title: "Generate your documents",
    text: "Proforma and commercial invoices, packing lists, quotations and more. Your company details fill in automatically and every document exports as a PDF.",
    visual: <DocumentCard />,
  },
  {
    icon: BellRing,
    title: "Follow up and keep records",
    text: "Keep buyers and suppliers in one place, set reminders, and see the full history of every conversation and document.",
    visual: <FollowUpCard />,
  },
];

export function Workflow() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 70%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section id="features" className="dark bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
          How it works
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
          One thread from first inquiry to final follow-up.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          IMPEXIO follows the same path your shipment does, so each step starts
          where the last one ended.
        </p>

        <ol ref={ref} className="relative mt-16 space-y-20 md:mt-24 md:space-y-28">
          {/* the thread */}
          <span
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-px bg-border"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : smooth }}
            className="absolute bottom-0 left-4 top-0 w-px origin-top bg-brass-light shadow-[0_0_12px_rgba(232,185,79,0.8)]"
          />

          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative grid gap-8 pl-14 md:grid-cols-2 md:items-center md:gap-14"
            >
              <span className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border border-brass/60 bg-background font-mono text-xs text-brass-light">
                {i + 1}
              </span>

              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <step.icon className="size-7 text-brass-light" />
                <h3 className="mt-4 text-2xl font-semibold md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-muted-foreground">
                  {step.text}
                </p>
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>{step.visual}</div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}