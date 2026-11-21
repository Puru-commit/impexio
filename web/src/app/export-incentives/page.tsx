import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { CtaBand, Gradient, PageHero, SectionHead } from "@/components/site/blocks";
import { IncentiveExplorer } from "@/components/site/incentive-explorer";
import { Reveal } from "@/components/site/reveal";
import { DATA_PRINCIPLES, INCENTIVES_AS_OF } from "@/lib/marketing";
import { CalendarClock, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Export Incentives — IMPEXIO",
  description: "RoDTEP, RoSCTL, Duty Drawback, GST, Advance Authorisation, EPCG, MOOWR and MAI explained in plain words. Free for everyone.",
};

async function Explorer() {
  await connection();
  const signedIn = !!(await auth());
  return <IncentiveExplorer signedIn={signedIn} />;
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Export Incentives"
          title={<>Claim every benefit <Gradient>you have earned.</Gradient></>}
          text="Eight government schemes that can cut your costs, explained in plain words: what each one is, who it is for and how to use it."
          actions={<span className="inline-flex items-center gap-2 rounded-full border border-brass/50 bg-brass/10 px-4 py-2 text-sm font-medium"><Gift className="size-4 text-[#9a6f1f]" />Free for everyone. Your first look needs no account.</span>}
        />
        <section className="bg-paper pb-20">
          <div className="mx-auto max-w-6xl px-5">
            <Suspense fallback={<IncentiveExplorerFallback />}>
              <Explorer />
            </Suspense>
          </div>
        </section>

        <section className="bg-[#ece6d6] py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="How we handle the facts" title={<>Official sources. <Gradient>Dated answers.</Gradient></>} text="Trade rules change, so we are careful about what we show you." />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {DATA_PRINCIPLES.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <div className="h-full rounded-2xl border border-border bg-white p-6">
                      <span className="font-mono text-xs text-[#9a6f1f]">0{i + 1}</span>
                      <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><CalendarClock className="size-4" />Content reviewed {INCENTIVES_AS_OF}. This is general guidance, not legal or tax advice. Always check the current notification before you claim.</p>
          </div>
        </section>
        <CtaBand title="Make incentives part of your pricing." text="Create a free account and use these benefits alongside the HS Code Finder and your first free document." />
      </main>
      <Footer />
    </>
  );
}

function IncentiveExplorerFallback() {
  return <div className="h-72 animate-pulse rounded-3xl border border-border bg-white" />;
}
