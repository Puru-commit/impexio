"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ScanSearch } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { TOOL_GROUPS, type Tool } from "@/lib/tools";

const GOLD = "text-[#9a6f1f]";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] ${GOLD}`}
    >
      <span className="size-1.5 rounded-full bg-brass" />
      {children}
    </p>
  );
}

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function ToolCard({ t, accent }: { t: Tool; accent: string }) {
  return (
    <Link
      href={`/tools/${t.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white/85 p-5 shadow-[0_20px_40px_-32px_rgba(11,16,32,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-[0_28px_50px_-28px_rgba(11,16,32,0.5)]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: accent }}
      />
      <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-brass-light transition-transform duration-300 group-hover:-rotate-6">
        <t.icon className="size-[18px]" />
      </span>
      <h3 className="mt-4 font-semibold leading-snug">{t.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{t.text}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Open
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------- Export */

export function ExportSection() {
  const group = TOOL_GROUPS.find((g) => g.id === "export")!;
  const costing = group.tools.slice(0, 4);
  const docs = group.tools.slice(4);
  const accent = "#c8963e";

  return (
    <section
      id="export"
      className="relative scroll-mt-28 overflow-hidden bg-[#ece6d6] text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 size-[420px] rounded-full bg-brass/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Eyebrow>Export</Eyebrow>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            Price it, pack it, <Accent>send it.</Accent>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Costing sheets, calculators and the documents your buyer expects,
            all in one place.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-8 bg-brass" />
            Costing and calculators
          </h3>
        </Reveal>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {costing.map((t, i) => (
            <li key={t.slug}>
              <Reveal delay={i * 0.06} className="h-full">
                <ToolCard t={t} accent={accent} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12">
          <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-8 bg-brass" />
            Documents and data
          </h3>
        </Reveal>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((t, i) => (
            <li key={t.slug}>
              <Reveal delay={i * 0.06} className="h-full">
                <ToolCard t={t} accent={accent} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Link
            href="/features#export"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/60 px-5 py-2.5 text-sm font-medium transition-all hover:border-brass/60 hover:bg-white"
          >
            See all export tools
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Import */

export function ImportSection() {
  const group = TOOL_GROUPS.find((g) => g.id === "import")!;
  const accent = "#2b6be6";

  return (
    <section
      id="import"
      className="relative scroll-mt-28 overflow-hidden bg-paper text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 size-[420px] rounded-full bg-signal/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1fr_1.1fr] md:py-28">
        <Reveal>
          <Eyebrow>Import</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">
            Bringing goods in, <Accent>without the paperwork stress.</Accent>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Ask suppliers for prices and place your order with clear,
            professional letters and purchase orders.
          </p>
          <Link
            href="/features#import"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98]"
          >
            Explore import tools
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2">
          {group.tools.map((t, i) => (
            <li key={t.slug}>
              <Reveal delay={i * 0.1} className="h-full">
                <ToolCard t={t} accent={accent} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- HS Code */

const EXAMPLES = [
  { product: "Cotton knitted T-shirts", code: "6109.10", desc: "T-shirts, singlets and similar, knitted, of cotton" },
  { product: "Green coffee beans", code: "0901.11", desc: "Coffee, not roasted, not decaffeinated" },
  { product: "Smartphone", code: "8517.13", desc: "Smartphones" },
  { product: "Milled rice", code: "1006.30", desc: "Rice, semi-milled or wholly milled" },
];

export function HsCodeSection() {
  const [i, setI] = useState(0);
  const ex = EXAMPLES[i];

  return (
    <section
      id="hs-code"
      className="dark relative scroll-mt-28 overflow-hidden bg-ink text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 size-[460px] rounded-full bg-brass/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 md:grid-cols-2 md:pb-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
            <ScanSearch className="size-3.5" />
            HS Code AI
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">
            Find the right HS code{" "}
            <span className="bg-gradient-to-r from-brass-light to-[#f4f1ea] bg-clip-text text-transparent">
              faster.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Describe your product in plain words. IMPEXIO suggests possible HS
            codes with the reason, so you can check them before you use them.
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Suggestions are guidance, not a legal classification. Always verify
            the final code with the official tariff or your customs broker.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brass-light px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-paper active:scale-[0.98]"
          >
            Try it free
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Try an example
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLES.map((e, n) => (
                <button
                  key={e.product}
                  type="button"
                  onClick={() => setI(n)}
                  aria-pressed={n === i}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                    n === i
                      ? "border-brass-light bg-brass-light text-ink"
                      : "border-white/15 text-foreground/80 hover:border-brass/60"
                  }`}
                >
                  {e.product}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <ScanSearch className="size-4 text-brass-light" />
              {ex.product}
            </div>

            <div
              key={ex.code}
              className="mt-3 animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-brass/50 bg-brass/10 p-4 duration-500"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-2xl text-brass-light">
                  {ex.code}
                </span>
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-muted-foreground">
                  Verify before use
                </span>
              </div>
              <p className="mt-2 text-sm">{ex.desc}</p>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Fixed examples to show the idea. The live AI finder comes with
              your account.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
