import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, Sparkles } from "lucide-react";
import { PageShell } from "@/components/site/legal-page";
import { Reveal } from "@/components/site/reveal";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "About — IMPEXIO" };

const POINTS = [
  {
    icon: FileText,
    title: "Documents in minutes",
    text: "Costing sheets, invoices, quotations, purchase orders and buyer letters, made from details you enter once.",
  },
  {
    icon: Sparkles,
    title: "Help with HS codes",
    text: "Describe a product and get possible HS codes with the reasoning, so you can check them.",
  },
  {
    icon: ShieldCheck,
    title: "Honest by design",
    text: "IMPEXIO is a tool to help you prepare. It is not approved by any government or customs authority.",
  },
];

export default function Page() {
  return (
    <PageShell
      eyebrow="About"
      title={
        <>
          Trade, without the{" "}
          <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
            complexity.
          </span>
        </>
      }
      intro={`${SITE.name} helps importers and exporters prepare their paperwork faster and with fewer mistakes.`}
    >
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Trade work often lives in spreadsheets, old documents and scattered
          emails. {SITE.name} brings costing, documents, HS code help and
          buyer follow-ups into one simple workspace, built for small and
          growing trade businesses.
        </p>
      </Reveal>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {POINTS.map((p, i) => (
          <li key={p.title}>
            <Reveal delay={i * 0.08} className="h-full">
              <div className="h-full rounded-3xl border border-border bg-white/80 p-6 shadow-[0_20px_40px_-34px_rgba(11,16,32,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-brass/50">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light">
                  <p.icon className="size-5" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-10">
        <div className="dark relative overflow-hidden rounded-3xl border border-brass/40 bg-ink p-8 text-foreground md:p-10">
          <div
            aria-hidden
            className="absolute -right-12 -top-12 size-52 rounded-full bg-brass/25 blur-3xl"
          />
          <h2 className="relative text-2xl font-semibold">Try it free</h2>
          <p className="relative mt-2 max-w-md text-muted-foreground">
            Create your first document free. Continue for {SITE.price} a month
            if it saves you time.
          </p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-brass-light px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-paper active:scale-[0.98]"
            >
              Start free and ask anything husstle free with our new imp AI
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium transition-all hover:border-brass/60"
            >
              Contact us
            </Link>
          </div>
        </div>
      </Reveal>
    </PageShell>
  );
}
