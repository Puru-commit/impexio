import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Btn, CtaBand, Gradient, PageHero, SectionHead } from "@/components/site/blocks";
import { ProcessFlow } from "@/components/site/process-flow";
import { Reveal } from "@/components/site/reveal";
import { IMPORT_DOCS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Import — IMPEXIO",
  description: "How importing into India works, step by step, and the nine import documents you will need.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Import"
          title={<>Bring goods into India <Gradient>with no surprises.</Gradient></>}
          text="See the full import journey, from checking the rules to clearing customs, and the documents you need on the way."
          actions={<><Btn href="#documents">See the 9 documents</Btn><Btn href="/register" variant="light">Start free</Btn></>}
        />
        <section className="bg-paper pb-20">
          <div className="mx-auto max-w-6xl px-5">
            <ProcessFlow kind="import" />
            <p className="mt-4 text-center text-xs text-muted-foreground">A general guide. Duty rates and approvals depend on the product, so check the current rules before you order.</p>
          </div>
        </section>
        <section id="documents" className="scroll-mt-24 bg-[#ece6d6] py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="Import documents" title={<>Nine documents, <Gradient>made simple.</Gradient></>} text="Some papers share a name with their export twin but do a different job on the import side. We show you the difference." />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {IMPORT_DOCS.map((d, i) => (
                <li key={d.title}>
                  <Reveal delay={(i % 3) * 0.06} className="h-full">
                    <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_24px_50px_-30px_rgba(11,16,32,0.5)]">
                      <div className="flex items-start justify-between">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-brass-light transition-transform group-hover:-rotate-6 group-hover:scale-105"><d.icon className="size-6" /></span>
                        {d.tag && <span className="rounded-full border border-border bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{d.tag}</span>}
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">{d.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.text}</p>
                      {d.sameAs && (
                        <p className="mt-4 rounded-xl bg-paper p-3 text-xs leading-relaxed text-muted-foreground"><b className="text-foreground">Also an export document. </b>{d.sameAs}</p>
                      )}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <CtaBand title="Import with the paperwork under control." text="Create your free account and keep every order and document in one place." secondary={{ href: "/pricing", label: "See pricing" }} />
      </main>
      <Footer />
    </>
  );
}
