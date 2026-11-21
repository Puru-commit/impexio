"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe2, Layers, Search } from "lucide-react";
import { TRADE_COUNTRIES, TRADE_SECTORS } from "@/lib/marketing";

export function TradeFinder({ role }: { role: "buyers" | "sellers" }) {
  const [product, setProduct] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const buyers = role === "buyers";
  const chip = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm transition-colors ${on ? "border-ink bg-ink text-paper" : "border-border bg-white hover:border-brass"}`;

  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-[0_40px_80px_-50px_rgba(11,16,32,0.5)] md:p-8">
      <label className="text-sm font-medium" htmlFor="tf-product">{buyers ? "What do you sell?" : "What do you want to buy?"} <span className="font-normal text-muted-foreground">(optional)</span></label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-paper px-4 focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/15">
        <Search className="size-5 text-muted-foreground" />
        <input id="tf-product" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="A product, or leave it empty" className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground" />
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm font-medium"><Layers className="size-4 text-[#9a6f1f]" />No product yet? Start with a sector</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TRADE_SECTORS.map((s) => (<button key={s} type="button" onClick={() => setSector(sector === s ? "" : s)} className={chip(sector === s)}>{s}</button>))}
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm font-medium"><Globe2 className="size-4 text-[#9a6f1f]" />Or start with a country</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TRADE_COUNTRIES.map((c) => (<button key={c} type="button" onClick={() => setCountry(country === c ? "" : c)} className={chip(country === c)}>{c}</button>))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          {product || sector || country ? <>Searching for <b className="text-foreground">{[product, sector, country].filter(Boolean).join(" · ")}</b></> : "You can search with just a sector, just a country, or both."}
        </p>
        <Link href="/register" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-primary">Create free account to search</Link>
      </div>
    </div>
  );
}
