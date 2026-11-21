import type { Metadata } from "next";
import { Suspense } from "react";
import { HsFinder } from "@/components/app/hs-finder";

export const metadata: Metadata = { title: "HS Code Finder — IMPEXIO" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Tool</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">HS Code Finder</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Search by product name or by code. Press Copy, or use the Find code button next to the HS code box inside any document.</p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-20 rounded-[28px] border border-border bg-white" />}>
          <HsFinder mode="app" />
        </Suspense>
      </div>
      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">Search results are guidance, not a legal classification. Always confirm the final code with the current customs tariff or your customs broker before you file.</p>
    </div>
  );
}
