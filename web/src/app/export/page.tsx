import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Btn, CtaBand, Gradient, ItemGrid, PageHero, SectionHead } from "@/components/site/blocks";
import { ProcessFlow } from "@/components/site/process-flow";
import { EXPORT_DOCS } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Export — IMPEXIO",
  description: "How exporting from India works, step by step, and the 12 export documents you will need.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Export"
          title={<>From first enquiry to payment, <Gradient>explained.</Gradient></>}
          text="Exporting looks hard until you see the steps. Follow the journey of an export shipment and the papers needed at each stage."
          actions={<><Btn href="#documents">See the 12 documents</Btn><Btn href="/register" variant="light">Start free</Btn></>}
        />
        <section className="bg-paper pb-20">
          <div className="mx-auto max-w-6xl px-5">
            <ProcessFlow kind="export" />
            <p className="mt-4 text-center text-xs text-muted-foreground">A general guide for Indian exporters. Requirements differ by product and country, so confirm with your customs broker.</p>
          </div>
        </section>
        <section id="documents" className="scroll-mt-24 bg-[#ece6d6] py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="Export documents" title={<>Twelve documents. <Gradient>One place to make them.</Gradient></>} text="Each document is filled from your company profile and your order, then exported as a print-ready PDF." />
            <ItemGrid items={EXPORT_DOCS} />
          </div>
        </section>
        <CtaBand title="Your first export document is free." text="Make a proforma invoice in minutes and see how IMPEXIO works." secondary={{ href: "/pricing", label: "See pricing" }} />
      </main>
      <Footer />
    </>
  );
}
