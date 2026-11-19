"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export type ListRow = { id: number; ref: string; date: string; status: "draft" | "final" | "cancelled"; cells: string[] };

const LABEL = { draft: "Draft", final: "Active", cancelled: "Cancelled" } as const;
const CLS = {
  draft: "border-[#c8963e]/50 bg-[#c8963e]/10 text-[#9a6f1f]",
  final: "border-[#2f7a4a]/40 bg-[#2f7a4a]/10 text-[#2f7a4a]",
  cancelled: "border-vermilion/40 bg-vermilion/10 text-vermilion",
} as const;

export function DocList({ headers, rows, rightCols }: { headers: string[]; rows: ListRow[]; rightCols: boolean[] }) {
  const [q, setQ] = useState("");
  const [st, setSt] = useState<"all" | ListRow["status"]>("all");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => (st === "all" || r.status === st) && (!needle || `${r.ref} ${r.cells.join(" ")}`.toLowerCase().includes(needle)));
  }, [rows, q, st]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search number, name, country…" className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" />
        </label>
        <div className="flex gap-1.5">
          {(["all", "final", "draft", "cancelled"] as const).map((x) => (
            <button key={x} type="button" onClick={() => setSt(x)} className={`rounded-full border px-3.5 py-2 text-xs font-medium ${st === x ? "border-ink bg-ink text-paper" : "border-border bg-white hover:border-brass"}`}>
              {x === "all" ? "All" : LABEL[x]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white/90">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Number</th><th className="px-3 py-3">Date</th>
              {headers.map((h, i) => <th key={h} className={`px-3 py-3 ${rightCols[i] ? "text-right" : ""}`}>{h}</th>)}
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={headers.length + 3} className="px-4 py-8 text-center text-muted-foreground">Nothing matches.</td></tr>}
            {shown.map((r) => (
              <tr key={r.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-brass/5">
                <td className="px-4 py-3 font-mono text-[13px]"><Link href={`/app/documents/${r.id}`} className="font-medium underline-offset-4 hover:underline">{r.ref || `#${r.id}`}</Link></td>
                <td className="px-3 py-3 text-muted-foreground">{r.date}</td>
                {r.cells.map((c, i) => <td key={i} className={`px-3 py-3 ${rightCols[i] ? "text-right font-mono text-[13px]" : ""}`}>{c}</td>)}
                <td className="px-4 py-3 text-right"><span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${CLS[r.status]}`}>{LABEL[r.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
