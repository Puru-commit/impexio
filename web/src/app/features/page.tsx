import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { TOOL_GROUPS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Features — IMPEXIO",
  description:
    "Export, import and EXIM marketing tools: costing, calculators, invoices, quotations, purchase orders and buyer letters.",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-24 size-[460px] rounded-full bg-brass/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-40 size-[420px] rounded-full bg-signal/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-16 md:pt-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
              <span className="size-1.5 rounded-full bg-brass" />
              Features
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Every tool you need,{" "}
              <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
                one click away.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Pick a tool, fill in your details and generate a ready document.
              Your company details are saved once and reused every time.
            </p>
            <nav aria-label="Feature groups" className="mt-8 flex flex-wrap gap-2">
              {TOOL_GROUPS.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm transition-colors hover:border-brass/60 hover:bg-white"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {TOOL_GROUPS.map((g) => (
          <section
            key={g.id}
            id={g.id}
            className="mx-auto max-w-6xl scroll-mt-32 px-5 py-12 md:py-16"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold md:text-4xl">{g.title}</h2>
                <p className="mt-2 text-muted-foreground">{g.intro}</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
                {g.tools.length} tools
              </span>
            </div>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {g.tools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="group relative flex h-full flex-col rounded-3xl border border-border bg-white/80 p-6 shadow-[0_24px_48px_-34px_rgba(11,16,32,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-brass/60 hover:bg-white"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light">
                      <t.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold leading-snug">
                      {t.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {t.text}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open tool
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mx-auto max-w-6xl px-5 pb-24 pt-8">
          <div className="dark relative overflow-hidden rounded-3xl border border-brass/40 bg-ink p-10 text-foreground md:p-14">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 size-64 rounded-full bg-brass/25 blur-3xl"
            />
            <h2 className="relative max-w-xl text-3xl font-semibold md:text-4xl">
              Create your first document free.
            </h2>
            <p className="relative mt-3 max-w-lg text-muted-foreground">
              No card needed to start. Continue for ₹249 a month if IMPEXIO
              saves you time.
            </p>
            <Link
              href="/register"
              className="relative mt-7 inline-block rounded-full bg-brass-light px-7 py-3.5 font-medium text-ink transition-all hover:bg-paper active:scale-[0.98]"
            >
              Start free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
