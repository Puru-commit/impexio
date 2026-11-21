"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Copy, SearchX, Search, X } from "lucide-react";
import { searchHsAction } from "@/app/app/hs/actions";
import type { HsHit } from "@/lib/hs";

type Mode = "public" | "app" | "picker";
type Data = { key?: string; rows: HsHit[]; total: number; page: number; pages: number; message?: string; ok: boolean };

const IDEAS = ["Rice", "Turmeric", "Cotton fabric", "Tea", "Coffee", "Leather", "Granite", "Spices"];
const LEVEL = { 4: "Heading", 6: "Sub-heading", 8: "Tariff item" } as const;

function Code({ code }: { code: string }) {
  const a = code.slice(0, 4), b = code.slice(4, 6), c = code.slice(6, 8);
  return (
    <span className="font-mono text-[26px] font-semibold leading-none tracking-tight text-ink">
      {a}
      {b && <span className="text-[#b4801f]">.{b}</span>}
      {c && <span className="text-[#b4801f]/70">.{c}</span>}
    </span>
  );
}

export function HsFinder({ mode, onPick }: { mode: Mode; onPick?: (code: string) => void }) {
  const sp = useSearchParams();
  const urlMode = mode !== "picker";
  const [q, setQ] = useState(() => (urlMode ? sp.get("q") ?? "" : ""));
  const [page, setPage] = useState(() => (urlMode ? Math.max(1, Number(sp.get("page")) || 1) : 1));
  const [data, setData] = useState<Data | null>(null);
  const [copied, setCopied] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const userPaged = useRef(false);
  const seq = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  const key = `${q.trim()}|${page}`;
  const searching = q.trim().length >= 2;
  const loading = searching && data?.key !== key;

  useEffect(() => {
    const id = ++seq.current;
    if (q.trim().length < 2) return;
    const t = setTimeout(async () => {
      let r: Data;
      try {
        r = mode === "public" ? await (await fetch(`/api/hs-search?q=${encodeURIComponent(q)}&page=${page}`)).json() : await searchHsAction(q, page);
      } catch {
        r = { ok: false, rows: [], total: 0, page: 1, pages: 0, message: "Search is not available right now. Please try again." };
      }
      if (id !== seq.current) return;
      setData({ ...r, key: `${q.trim()}|${page}` });
      if (userPaged.current) { topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); userPaged.current = false; }
    }, 280);
    return () => clearTimeout(t);
  }, [q, page, mode]);

  // keep the address bar in step so a search can be shared or reopened
  useEffect(() => {
    if (!urlMode) return;
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (q.trim() && page > 1) p.set("page", String(page));
    window.history.replaceState(null, "", p.toString() ? `?${p}` : window.location.pathname);
  }, [q, page, urlMode]);

  const go = useCallback((n: number) => { userPaged.current = true; setPage(n); }, []);
  const copy = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(""), 1600); } catch { /* ignore */ }
  };

  const grid = mode === "picker" ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {/* search bar */}
      <div className="rounded-[28px] border border-border bg-white p-2 shadow-[0_30px_60px_-40px_rgba(11,16,32,0.55)] focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/15">
        <label className="flex items-center gap-3 px-4 py-2.5">
          <Search className="size-5 shrink-0 text-[#9a6f1f]" />
          <input
            ref={input} value={q} autoFocus={mode !== "public"} aria-label="Search HS codes" autoComplete="off" spellCheck={false}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search a product, e.g. basmati rice, or a code, e.g. 1006"
            className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/60"
          />
          {q && <button type="button" aria-label="Clear" onClick={() => { setQ(""); setPage(1); input.current?.focus(); }} className="rounded-full p-1.5 text-muted-foreground hover:bg-paper hover:text-foreground"><X className="size-4" /></button>}
        </label>
      </div>

      <div ref={topRef} className="scroll-mt-28" />

      {/* idea chips */}
      {!searching && (
        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Try searching for</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {IDEAS.map((w) => (
              <button key={w} type="button" onClick={() => { setQ(w); setPage(1); }} className="rounded-full border border-border bg-white px-4 py-2 text-sm transition-colors hover:border-brass hover:bg-brass/10">{w}</button>
            ))}
          </div>
          <p className="mt-6 max-w-xl text-sm text-muted-foreground">You can also type the first digits of a code, for example <span className="font-mono text-foreground">1006</span>, to see everything under that heading.</p>
        </div>
      )}

      {/* status line */}
      {searching && (
        <p className="mt-6 min-h-5 text-sm text-muted-foreground" aria-live="polite">
          {loading && !data ? "Searching…" : data && data.total > 0 ? <>Showing <b className="text-foreground">{(data.page - 1) * 9 + 1}–{(data.page - 1) * 9 + data.rows.length}</b> of <b className="text-foreground">{data.total.toLocaleString("en-IN")}</b> results for “{q.trim()}”</> : ""}
        </p>
      )}

      {/* error */}
      {searching && data && !data.ok && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" /> {data.message}</div>
      )}

      {/* empty */}
      {searching && !loading && data?.ok && data.total === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-white/60 px-6 py-12 text-center">
          <SearchX className="mx-auto size-9 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">No match for “{q.trim()}”</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Try one simple word instead of a long name, for example “rice” instead of “basmati rice 1121”. Or type the first digits of a code.</p>
        </div>
      )}

      {/* skeletons */}
      {searching && loading && !data && (
        <ul className={`mt-4 grid gap-4 ${grid}`} aria-hidden>
          {Array.from({ length: 9 }, (_, i) => <li key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-white/70" />)}
        </ul>
      )}

      {/* results */}
      {searching && data && data.rows.length > 0 && (
        <ul className={`mt-4 grid gap-4 transition-opacity ${grid} ${loading ? "opacity-50" : ""}`}>
          {data.rows.map((r, i) => {
            const path = [r.heading, r.context].filter((x) => x && x !== r.desc).join("  ›  ");
            return (
              <li key={`${r.code}-${i}`} className="group flex flex-col rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass/60 hover:shadow-[0_24px_40px_-30px_rgba(11,16,32,0.5)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9a6f1f]">Chapter {Number(r.code.slice(0, 2))}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{LEVEL[r.level as 4 | 6 | 8] ?? "Item"}</span>
                </div>
                <div className="mt-4"><Code code={r.code} /></div>
                <p className="mt-3 text-[15px] font-semibold leading-snug">{r.desc || r.heading || "—"}</p>
                {path && <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{path}</p>}
                <div className="mt-auto flex gap-2 pt-4">
                  {onPick && <button type="button" onClick={() => onPick(r.code)} className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-primary">Use this code</button>}
                  <button type="button" onClick={() => copy(r.code)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-medium transition-colors hover:border-brass">
                    {copied === r.code ? <Check className="size-3.5 text-[#2f7a4a]" /> : <Copy className="size-3.5" />} {copied === r.code ? "Copied" : "Copy code"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* pagination */}
      {searching && data && data.pages > 1 && (
        <nav aria-label="Pages" className="mt-8 flex items-center justify-between gap-3">
          <button type="button" disabled={data.page <= 1 || loading} onClick={() => go(data.page - 1)} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:border-brass disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft className="size-4" /> Previous
          </button>
          <span className="text-sm text-muted-foreground">Page <b className="text-foreground">{data.page}</b> of {data.pages.toLocaleString("en-IN")}</span>
          <button type="button" disabled={data.page >= data.pages || loading} onClick={() => go(data.page + 1)} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40">
            Next <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
