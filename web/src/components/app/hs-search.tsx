"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { searchHsAction } from "@/app/app/hs/actions";
import { fmtHs, type HsHit } from "@/lib/hs";

type Props = {
  onPick?: (code: string) => void;
  autoFocus?: boolean;
  /** Use on the public home page: searches through the public API and shows a login note. */
  publicMode?: boolean;
  /** Dark background (home page section). */
  dark?: boolean;
};

export function HsSearch({ onPick, autoFocus, publicMode, dark }: Props) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<HsHit[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const seq = useRef(0);

  useEffect(() => {
    const id = ++seq.current;
    const t = setTimeout(async () => {
      if (q.trim().length < 2) { setRows([]); setMsg(""); return; }
      setBusy(true);
      let r: { rows: HsHit[]; message?: string };
      try {
        r = publicMode ? await (await fetch(`/api/hs-search?q=${encodeURIComponent(q)}`)).json() : await searchHsAction(q);
      } catch {
        r = { rows: [], message: "Search is not available right now." };
      }
      if (id !== seq.current) return;
      setBusy(false);
      setRows(r.rows ?? []);
      setMsg(r.message ?? ((r.rows ?? []).length === 0 ? "No match. Try a simpler word, for example “rice” instead of “basmati rice 1121”." : ""));
    }, 250);
    return () => clearTimeout(t);
  }, [q, publicMode]);

  const copy = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(""), 1500); } catch { /* ignore */ }
  };

  const c = dark
    ? { input: "border-white/15 bg-white/5 text-foreground placeholder:text-muted-foreground focus:border-brass-light focus:ring-brass/30", muted: "text-muted-foreground", card: "border-white/10 bg-white/[0.05]", code: "text-brass-light", btn: "border-white/20 bg-white/5 text-foreground hover:border-brass-light" }
    : { input: "border-border bg-white placeholder:text-muted-foreground/60 focus:border-brass focus:ring-brass/20", muted: "text-muted-foreground", card: "border-border bg-white/90", code: "", btn: "border-border bg-white hover:border-brass" };

  return (
    <div>
      <label className="relative block">
        <Search className={`absolute left-4 top-1/2 size-5 -translate-y-1/2 ${c.muted}`} />
        <input autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search HS codes" placeholder="Type a product (rice, cotton saree, turmeric) or a code (1006)…"
          className={`w-full rounded-full border py-3.5 pl-12 pr-5 text-base outline-none focus:ring-2 ${c.input}`} />
      </label>
      <p className={`mt-2 min-h-5 text-xs ${c.muted}`}>{busy ? "Searching…" : msg || (rows.length ? `${rows.length} results${publicMode ? " (top matches)" : ""}` : "Type at least 2 letters or digits.")}</p>

      <ul className="mt-2 space-y-2">
        {rows.map((r, i) => (
          <li key={`${r.code}-${i}`} className={`flex items-start gap-3 rounded-2xl border p-3.5 ${c.card}`}>
            <div className="w-24 shrink-0 sm:w-28">
              <div className={`font-mono text-base font-semibold ${c.code}`}>{fmtHs(r.code)}</div>
              <div className={`font-mono text-[10px] uppercase tracking-wider ${c.muted}`}>{r.level === 4 ? "Heading" : r.level === 6 ? "Sub-heading" : "Tariff item"}</div>
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <div className="font-medium">{r.desc || r.heading || "—"}</div>
              {(r.context || r.heading) && <div className={`mt-0.5 text-xs ${c.muted}`}>{[r.heading, r.context].filter((x) => x && x !== r.desc).join("  ›  ")}</div>}
            </div>
            <div className="flex shrink-0 gap-1.5">
              {onPick && <button type="button" onClick={() => onPick(r.code)} className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper hover:bg-primary">Use</button>}
              <button type="button" onClick={() => copy(r.code)} aria-label="Copy code" className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium ${c.btn}`}>
                {copied === r.code ? <Check className="size-3.5 text-[#2f7a4a]" /> : <Copy className="size-3.5" />} {copied === r.code ? "Copied" : "Copy"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {publicMode && rows.length > 0 && (
        <p className={`mt-4 text-sm ${c.muted}`}>
          Want the full list and a one-click “Use code” inside your documents?{" "}
          <Link href="/register" className="font-medium text-brass-light underline underline-offset-4">Create a free account</Link>
        </p>
      )}
    </div>
  );
}
