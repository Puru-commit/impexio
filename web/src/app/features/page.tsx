import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Atmosphere } from "@/components/site/atmosphere";
import { Dawn } from "@/components/site/transitions";
import { Reveal } from "@/components/site/reveal";
import { ALL_TOOLS, TOOL_GROUPS, UPCOMING_AGENTS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Features — IMPEXIO",
  description:
    "Export, import and EXIM marketing tools, plus the AI agents coming to IMPEXIO.",
};

const GROUP_ACCENT: Record<string, string> = {
  export: "#c8963e",
  import: "#2b6be6",
  "exim-marketing": "#d8432f",
};

const GRID =
  "linear-gradient(rgba(11,16,32,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,16,32,0.05) 1px, transparent 1px)";
const FADE = "radial-gradient(ellipse 75% 70% at 50% 35%, black, transparent 80%)";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: GRID,
              backgroundSize: "56px 56px",
              maskImage: FADE,
              WebkitMaskImage: FADE,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-24 size-[480px] rounded-full bg-brass/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-32 size-[440px] rounded-full bg-signal/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 md:pb-20 md:pt-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
              <span className="size-1.5 rounded-full bg-brass" />
              Features
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] md:text-6xl">
              Every tool you need,{" "}
              <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
                one click away.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Pick a tool, fill in your details and generate a ready document.
              Your company details are saved once and reused every time.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {TOOL_GROUPS.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-brass/60 hover:bg-white"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: GROUP_ACCENT[g.id] }}
                  />
                  {g.title}
                </a>
              ))}
              <a
                href="#upcoming"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-primary"
              >
                <Sparkles className="size-4 text-brass-light" />
                Coming soon
              </a>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              {[
                [String(ALL_TOOLS.length), "tools ready to build"],
                [String(TOOL_GROUPS.length), "tool groups"],
                [String(UPCOMING_AGENTS.length), "AI agents planned"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-border bg-white/70 p-4 backdrop-blur-sm"
                >
                  <dt className="font-heading text-3xl font-semibold md:text-4xl">
                    {n}
                  </dt>
                  <dd className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Tool groups */}
        {TOOL_GROUPS.map((g) => {
          const accent = GROUP_ACCENT[g.id];
          return (
            <section
              key={g.id}
              id={g.id}
              className="mx-auto max-w-6xl scroll-mt-32 px-5 py-12 md:py-16"
            >
              <Reveal className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-start gap-4">
                  <span
                    className="mt-2 hidden h-12 w-1 rounded-full sm:block"
                    style={{ background: accent }}
                  />
                  <div>
                    <h2 className="text-2xl font-semibold md:text-4xl">
                      {g.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">{g.intro}</p>
                  </div>
                </div>
                <span
                  className="rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-[0.2em]"
                  style={{ borderColor: `${accent}66`, color: "#7a5a1a" }}
                >
                  {g.tools.length} tools
                </span>
              </Reveal>

              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {g.tools.map((t, i) => (
                  <li key={t.slug}>
                    <Reveal delay={(i % 4) * 0.07} className="h-full">
                      <Link
                        href={`/tools/${t.slug}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white/85 p-6 shadow-[0_24px_48px_-34px_rgba(11,16,32,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:bg-white hover:shadow-[0_30px_60px_-28px_rgba(11,16,32,0.5)]"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                          style={{ background: accent }}
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                          style={{ background: accent }}
                        />
                        <div className="relative flex items-center justify-between">
                          <span className="flex size-12 items-center justify-center rounded-2xl bg-ink text-brass-light transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                            <t.icon className="size-5" />
                          </span>
                          <span className="font-mono text-xs text-muted-foreground/70">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="relative mt-5 text-lg font-semibold leading-snug">
                          {t.title}
                        </h3>
                        <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {t.text}
                        </p>
                        <span className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                          Open tool
                          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* Light to dark */}
        <Atmosphere compact />

        {/* Upcoming AI agents */}
        <section id="upcoming" className="dark relative overflow-hidden bg-ink text-foreground">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: FADE,
              WebkitMaskImage: FADE,
            }}
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 md:pb-28">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
                <Sparkles className="size-3.5" />
                Coming soon
              </p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                AI agents for{" "}
                <span className="bg-gradient-to-r from-brass-light to-[#f4f1ea] bg-clip-text text-transparent">
                  export-import.
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                Ten AI agents are planned for IMPEXIO. We will release them
                step by step, starting with the ones traders ask for most.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {UPCOMING_AGENTS.map((a, i) => (
                <li key={a.n}>
                  <Reveal delay={(i % 2) * 0.08} className="h-full">
                    <div className="group relative flex h-full items-start gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -left-10 -top-10 size-36 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
                        style={{ background: a.color }}
                      />
                      <span
                        className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          background: `${a.color}26`,
                          color: a.color,
                          boxShadow: `inset 0 0 0 1px ${a.color}55`,
                        }}
                      >
                        <a.icon className="size-6" />
                      </span>
                      <div className="relative min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold leading-snug">
                            {a.title}
                          </h3>
                          <span className="font-mono text-xs text-muted-foreground">
                            {String(a.n).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {a.text}
                        </p>
                        <span className="mt-3 inline-block rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-brass-light">
                          Coming soon
                        </span>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dark back to light */}
        <Dawn />

        <section className="mx-auto max-w-6xl px-5 pb-12 pt-4">
          <Reveal>
            <div className="dark relative overflow-hidden rounded-3xl border border-brass/40 bg-ink p-10 text-foreground shadow-[0_40px_80px_-30px_rgba(11,16,32,0.6)] md:p-14">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 size-64 rounded-full bg-brass/25 blur-3xl"
              />
              <h2 className="relative max-w-xl text-3xl font-semibold md:text-4xl">
                Create your first document free.
              </h2>
              <p className="relative mt-3 max-w-lg text-muted-foreground">
                Start with one free document. Continue for ₹249 a month if
                IMPEXIO saves you time.
              </p>
              <Link
                href="/register"
                className="relative mt-7 inline-block rounded-full bg-brass-light px-7 py-3.5 font-medium text-ink transition-all hover:bg-paper active:scale-[0.98]"
              >
                Start free
              </Link>
            </div>
          </Reveal>
        </section>
        <Atmosphere compact />
      </main>
      <Footer />
    </>
  );
}
