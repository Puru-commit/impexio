import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { CtaBand, Gradient, PageHero, SectionHead } from "@/components/site/blocks";
import { PlanCards } from "@/components/site/plan-cards";
import { FAQ_PRICING } from "@/lib/marketing";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — IMPEXIO",
  description: "Start free. Get every tool for ₹499 a month, ₹4,999 a year, or ₹9,999 for life.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero eyebrow="Pricing" title={<>Start free. <Gradient>Grow when you are ready.</Gradient></>} text="Try the AI HS Code Finder and one document for free. Then unlock every tool in every module with one simple plan." />
        <section className="bg-[#ece6d6] pb-20 pt-4">
          <div className="mx-auto max-w-6xl px-5">
            <PlanCards />
            <p className="mt-8 text-center text-sm text-muted-foreground">Prices are in Indian rupees. Payments are handled securely by Razorpay.</p>
          </div>
        </section>
        <section className="bg-paper py-20">
          <div className="mx-auto max-w-3xl px-5">
            <SectionHead center eyebrow="Questions" title="About pricing" />
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-white">
              {FAQ_PRICING.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}<Plus className="size-4 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <CtaBand title="Try it free today." text="No card needed. Your first document and the HS Code Finder are on us." />
      </main>
      <Footer />
    </>
  );
}
