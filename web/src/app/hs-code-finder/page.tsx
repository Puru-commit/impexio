import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Copy, Layers, ListOrdered } from "lucide-react";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { HsFinder } from "@/components/app/hs-finder";

export const metadata: Metadata = {
  title: "HS Code Finder — IMPEXIO",
  description: "Search HS codes by product name or by code. Free, no sign-up needed.",
};

const GRID = "linear-gradient(rgba(11,16,32,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,16,32,0.05) 1px, transparent 1px)";
const FADE = "radial-gradient(ellipse 75% 70% at 50% 30%, black, transparent 80%)";

const FACTS = [
  { icon: Layers, title: "Full code list", text: "Headings, sub-headings and tariff items across the HS chapters." },
  { icon: ListOrdered, title: "Nine at a time", text: "Results come in clean pages of nine, with Previous and Next." },
  { icon: Copy, title: "Copy in one click", text: "Copy any code, then paste it into your invoice or quotation." },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: GRID, backgroundSize: "56px 56px", maskImage: FADE, WebkitMaskImage: FADE }} />
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 size-[460px] rounded-full bg-brass/25 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-14 md:pb-10 md:pt-20">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
              <span className="size-1.5 rounded-full bg-brass" />
              HS Code Finder
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] md:text-6xl">
              Find the right HS code,{" "}
              <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">in seconds.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Type a product name or the start of a code. See where each code sits in the list, then copy it. Free to use, no sign-up needed.</p>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <Suspense fallback={<div className="h-20 rounded-[28px] border border-border bg-white" />}>
            <HsFinder mode="public" />
          </Suspense>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-white/70 p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-brass-light"><f.icon className="size-5" /></span>
                <h2 className="mt-4 text-base font-semibold">{f.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink px-6 py-6 text-paper md:px-8">
            <div>
              <p className="text-lg font-semibold">Want the code inside your documents?</p>
              <p className="mt-1 text-sm text-paper/70">With a free account, a Find code button sits right next to the HS code box in every invoice.</p>
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-brass-light px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-white active:scale-[0.98]">
              Create a free account <ArrowRight className="size-4" />
            </Link>
          </div>

          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">Search results are guidance, not a legal classification. IMPEXIO is not a government or customs authority. Always confirm the final code with the current customs tariff or your customs broker before you file.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
