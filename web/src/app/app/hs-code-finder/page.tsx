import type { Metadata } from "next";
import { HsSearch } from "@/components/app/hs-search";

export const metadata: Metadata = { title: "HS Code Finder — IMPEXIO" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Tool</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">HS Code Finder</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Search the Indian HS / GST code list by product name or by code. Press Copy, or use the Find button next to the HS code box inside any document.</p>
      <div className="mt-8"><HsSearch autoFocus /></div>
      <p className="mt-10 text-xs text-muted-foreground">Codes come from the HSN list you supplied. Always confirm the final code with your CHA or the current customs tariff before filing.</p>
    </div>
  );
}
