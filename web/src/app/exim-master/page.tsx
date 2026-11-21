import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Btn, CtaBand, Gradient, ItemGrid, PageHero, SectionHead } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { COST_TERMS, EXIM_TOOLS } from "@/lib/marketing";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "EXIM Master — IMPEXIO",
  description: "Export quotation, cost calculators for FOB, CIF and CFR, sea port finder, HS code finder and CBM calculator.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="EXIM Master"
          title={<>Every trade tool you reach for, <Gradient>in one place.</Gradient></>}
          text="Quote, cost, classify and plan a shipment. The everyday calculators and finders of an exporter, built to be fast and simple."
          actions={<><Btn href="/hs-code-finder">Try the HS Code Finder</Btn><Btn href="/register" variant="light">Start free</Btn></>}
          aside={
            <Reveal className="rounded-3xl border border-border bg-white p-6 shadow-[0_40px_80px_-50px_rgba(11,16,32,0.5)]">
              <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light"><Calculator className="size-5" /></span><div><p className="font-semibold">Export Cost Calculator</p><p className="text-xs text-muted-foreground">Pick your price term</p></div></div>
              <ul className="mt-5 grid grid-cols-2 gap-2">
                {COST_TERMS.map((t, i) => (
                  <li key={t.code} className={`rounded-xl border px-3 py-2.5 ${i === 2 ? "border-brass bg-brass/10" : "border-border bg-paper"}`}>
                    <span className="font-mono text-sm font-semibold">{t.code}</span>
                    <span className="block text-xs text-muted-foreground">{t.name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          }
        />
        <section className="bg-paper pb-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="The toolkit" title="Nine tools. One workspace." text="Start with what you need today. Everything works together, so a quote becomes an invoice without retyping." />
            <ItemGrid items={EXIM_TOOLS} />
          </div>
        </section>

        <section id="cost" className="scroll-mt-28 bg-[#ece6d6] py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
            <div>
              <SectionHead eyebrow="Cost calculator" title={<>Know your price under <Gradient>every term.</Gradient></>} text="Add your product cost and expenses. The calculator builds the price for the term you choose and shows your margin before you send the quote." />
            </div>
            <Reveal>
              <ul className="space-y-3">
                {[
                  ["FOB", "Goods loaded on the ship at the port of loading."],
                  ["CIF", "FOB plus sea freight and insurance to the destination port."],
                  ["CFR / CNF", "FOB plus sea freight, without insurance."],
                  ["EXW, FCA, CPT", "From your factory gate to carriage paid, for flexible deals."],
                  ["DAP, DDP", "You deliver to the buyer's place, with or without import duty."],
                ].map(([a, b]) => (
                  <li key={a} className="flex gap-4 rounded-2xl border border-border bg-white p-4"><span className="w-28 shrink-0 font-mono text-sm font-semibold text-[#9a6f1f]">{a}</span><span className="text-sm text-muted-foreground">{b}</span></li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="quotation" className="scroll-mt-28 bg-paper py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-3">
            {[
              ["quotation", "Export Quotation", "Choose the buyer, add your items, set the price term, validity and payment terms. Get a clean, professional quotation as a PDF."],
              ["ports", "Sea Port Finder", "Search ports by name or country and see the code and details you need for your booking and documents."],
              ["more", "CBM and more", "Cubic metres, container fit, margin, currency and unit conversion, and a plain guide to Incoterms."],
            ].map(([id, t, d], i) => (
              <Reveal key={id} delay={i * 0.08} className="scroll-mt-28">
                <div id={id} className="h-full rounded-2xl border border-border bg-white p-7">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">0{i + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <CtaBand title="Quote with confidence." text="Open your free account and use the AI HS Code Finder today." secondary={{ href: "/pricing", label: "See pricing" }} />
      </main>
      <Footer />
    </>
  );
}
