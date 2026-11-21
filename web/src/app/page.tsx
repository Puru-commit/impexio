import Link from "next/link";
import { ArrowUpRight, Gift, Plus } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HomeHero } from "@/components/site/home-hero";
import { Btn, CtaBand, Gradient, SectionHead } from "@/components/site/blocks";
import { PlanCards } from "@/components/site/plan-cards";
import { Reveal } from "@/components/site/reveal";
import { DATA_PRINCIPLES, SCHEMES } from "@/lib/marketing";
import { Calculator, Percent, Ship, Store, Plane } from "lucide-react";

const MODULES = [
  { title: "EXIM Master", text: "Quotations, cost calculators for every price term, a sea port finder, the HS Code Finder and CBM.", href: "/exim-master", icon: Calculator, chips: ["FOB", "CIF", "CFR", "HS Code", "CBM"], span: "lg:col-span-2" },
  { title: "Export", text: "See how an export works and make all 12 export documents.", href: "/export", icon: Plane, chips: ["12 documents"], span: "" },
  { title: "Import", text: "Follow the import journey and prepare the 9 import documents.", href: "/import", icon: Ship, chips: ["9 documents"], span: "" },
  { title: "Export Incentives", text: "RoDTEP, RoSCTL, Duty Drawback, GST, Advance Authorisation, EPCG, MOOWR and MAI, free for everyone.", href: "/export-incentives", icon: Percent, chips: ["Free", "8 schemes"], span: "lg:col-span-2" },
  { title: "Buyers and Sellers", text: "Find buyers and suppliers. Start with a sector or a country, no product needed.", href: "/buyers", icon: Store, chips: ["Buyers", "Sellers"], span: "lg:col-span-2" },
];

const FAQS = [
  { q: "Are IMPEXIO documents approved by customs or the government?", a: "No. IMPEXIO helps you prepare professional documents from the information you enter. They are not approved or certified by any government or customs authority. Always confirm requirements with your customs broker or the relevant authority." },
  { q: "How reliable are the HS code results?", a: "They help you start and show the full code path so you can check them. Verify the final code against the official tariff or with your customs broker before you use it." },
  { q: "What do I get on the free trial?", a: "The AI HS Code Finder and one free document. The Export Incentives guide is free for everyone." },
  { q: "Can other users see my data?", a: "No. Each account can only access its own documents and records." },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HomeHero />

        <section className="bg-paper py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="Everything in one place" title={<>Five areas. <Gradient>One workspace.</Gradient></>} text="Pick the part of trade you are working on today. Everything is connected, so nothing is typed twice." />
            <ul className="mt-12 grid gap-4 lg:grid-cols-4">
              {MODULES.map((m, i) => (
                <li key={m.title} className={m.span}>
                  <Reveal delay={(i % 3) * 0.07} className="h-full">
                    <Link href={m.href} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_30px_60px_-35px_rgba(11,16,32,0.5)]">
                      <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-brass/0 blur-2xl transition-colors group-hover:bg-brass/25" />
                      <div className="flex items-start justify-between">
                        <span className="flex size-13 items-center justify-center rounded-2xl bg-ink p-3.5 text-brass-light"><m.icon className="size-6" /></span>
                        <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <h3 className="mt-6 text-2xl font-semibold">{m.title}</h3>
                      <p className="mt-2 flex-1 text-muted-foreground">{m.text}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">{m.chips.map((c) => (<li key={c} className="rounded-full border border-border bg-paper px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{c}</li>))}</ul>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#ece6d6] py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
            <div>
              <SectionHead eyebrow="Learn the process" title={<>Know every step <Gradient>before you ship.</Gradient></>} text="Watch an export or an import unfold step by step, with the papers you need at each stage." />
              <div className="mt-8 flex flex-wrap gap-3"><Btn href="/export">How exporting works</Btn><Btn href="/import" variant="light">How importing works</Btn></div>
            </div>
            <Reveal>
              <ol className="space-y-3">
                {["Find the product and the HS code", "Quote the price and confirm the order", "Prepare the documents", "Clear customs and ship", "Get paid and claim your incentives"].map((t, i) => (
                  <li key={t} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4"><span className="flex size-9 items-center justify-center rounded-full bg-ink font-mono text-sm text-paper">{i + 1}</span><span className="font-medium">{t}</span></li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        <section className="bg-paper px-5 py-20">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink p-8 text-paper md:p-14">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[360px] rounded-full bg-brass/30 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brass-light"><Gift className="size-3.5" />Free for everyone</p>
                <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">Are you missing out on export incentives?</h2>
                <p className="mt-4 text-lg text-paper/70">Eight schemes can lower your costs. We explain each in plain words, with the official source and the date. No account needed to start.</p>
                <div className="mt-7"><Btn href="/export-incentives" variant="brass">Explore incentives</Btn></div>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {SCHEMES.map((s) => (
                  <li key={s.id}><Link href="/export-incentives" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"><s.icon className="size-4 text-brass-light" />{s.name}</Link></li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section className="bg-paper pb-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="Built on trust" title={<>Official sources. <Gradient>Honest data.</Gradient></>} />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DATA_PRINCIPLES.map((p, i) => (
                <li key={p.title}><Reveal delay={i * 0.06} className="h-full"><div className="h-full rounded-2xl border border-border bg-white p-6"><span className="font-mono text-xs text-[#9a6f1f]">0{i + 1}</span><h3 className="mt-2 text-lg font-semibold">{p.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p></div></Reveal></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#ece6d6] py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead center eyebrow="Pricing" title={<>Start free. <Gradient>Upgrade when it pays off.</Gradient></>} text="One free document and the AI HS Code Finder to begin. Then every tool, from ₹499 a month." />
            <PlanCards />
          </div>
        </section>

        <section className="bg-paper py-20">
          <div className="mx-auto max-w-3xl px-5">
            <SectionHead center eyebrow="Questions" title="Good to know" />
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-white">
              {FAQS.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">{f.q}<Plus className="size-4 shrink-0 transition-transform group-open:rotate-45" /></summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CtaBand title="Make your next shipment your easiest." text="Create a free account. Use the AI HS Code Finder and make your first document today." secondary={{ href: "/pricing", label: "See pricing" }} />
      </main>
      <Footer />
    </>
  );
}
