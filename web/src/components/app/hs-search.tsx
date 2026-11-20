"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { searchHsAction } from "@/app/app/hs/actions";
import { fmtHs, type HsHit } from "@/lib/hs";

export function HsSearch({ onPick, autoFocus }: { onPick?: (code: string) => void; autoFocus?: boolean }) {
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
      const r = await searchHsAction(q);
      if (id !== seq.current) return;
      setBusy(false);
      setRows(r.rows);
      setMsg(r.message ?? (r.rows.length === 0 ? "No match. Try a simpler word, for example “rice” instead of “basmati rice 1121”." : ""));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const copy = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(""), 1500); } catch { /* ignore */ }
  };

  return (
    <div>
      <label className="relative block">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a product (rice, cotton saree, turmeric) or a code (1006)…"
          className="w-full rounded-full border border-border bg-white py-3.5 pl-12 pr-5 text-base outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" />
      </label>
      <p className="mt-2 min-h-5 text-xs text-muted-foreground">{busy ? "Searching…" : msg || (rows.length ? `${rows.length}${rows.length === 60 ? "+" : ""} results` : "Type at least 2 letters or digits.")}</p>

      <ul className="mt-2 space-y-2">
        {rows.map((r, i) => (
          <li key={`${r.code}-${i}`} className="flex items-start gap-3 rounded-2xl border border-border bg-white/90 p-3.5">
            <div className="w-28 shrink-0">
              <div className="font-mono text-base font-semibold">{fmtHs(r.code)}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{r.level === 4 ? "Heading" : r.level === 6 ? "Sub-heading" : "Tariff item"}</div>
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <div className="font-medium">{r.desc || r.heading || "—"}</div>
              {(r.context || r.heading) && <div className="mt-0.5 text-xs text-muted-foreground">{[r.heading, r.context].filter((x) => x && x !== r.desc).join("  ›  ")}</div>}
            </div>
            <div className="flex shrink-0 gap-1.5">
              {onPick && <button type="button" onClick={() => onPick(r.code)} className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper hover:bg-primary">Use</button>}
              <button type="button" onClick={() => copy(r.code)} aria-label="Copy code" className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-brass">
                {copied === r.code ? <Check className="size-3.5 text-[#2f7a4a]" /> : <Copy className="size-3.5" />} {copied === r.code ? "Copied" : "Copy"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
