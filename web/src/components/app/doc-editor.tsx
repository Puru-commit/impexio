"use client";

import Link from "next/link";
import { Suspense, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Ban, CheckCircle2, Copy, Download, Eye, FileEdit, Lock, Plus, RefreshCw, Save, Trash2, Wand2 } from "lucide-react";
import { Paper } from "@/components/app/doc-paper";
import { HsFinder } from "@/components/app/hs-finder";
import { TOOL_DEFS, effectiveLetter } from "@/lib/doc/defs";
import {
  blankLine, buildView, computeMatrix, fmt, isUsed, readiness, rowAmount, showCell,
  type DocData, type Field, type MRow, type Section, type TCol,
} from "@/lib/doc/core";
import { cancelDocumentAction, carryForwardAction, finaliseDocumentAction, masterCompanyAction, saveDocumentAction } from "@/app/app/documents/actions";
import type { CompanyValues } from "@/lib/company";

type Status = "draft" | "final" | "cancelled";
const SPAN = { 1: "sm:col-span-1", 2: "sm:col-span-2", 3: "sm:col-span-2 lg:col-span-3", 4: "sm:col-span-2 lg:col-span-4" } as const;
const input =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-brass focus:ring-2 focus:ring-brass/20 disabled:bg-muted/50 disabled:text-muted-foreground";

function Control({ f, value, onChange, disabled, invalid }: { f: Field | TCol; value: string; onChange: (v: string) => void; disabled: boolean; invalid?: boolean }) {
  const cls = `${input} ${invalid ? "border-vermilion/60 ring-2 ring-vermilion/10" : ""}`;
  const kind = f.kind ?? "text";
  if (kind === "select")
    return (
      <select id={`f-${f.k}`} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={cls}>
        <option value="">Select…</option>
        {(f.opts ?? []).filter(Boolean).map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  if (kind === "area") return <textarea id={`f-${f.k}`} rows={3} value={value} disabled={disabled} placeholder={f.ph} onChange={(e) => onChange(e.target.value)} className={cls} />;
  return (
    <input
      id={`f-${f.k}`} value={value} disabled={disabled} placeholder={f.ph} inputMode={kind === "num" ? "decimal" : undefined}
      type={kind === "date" ? "date" : "text"} onChange={(e) => onChange(e.target.value)} className={cls}
    />
  );
}

function Card({ n, title, note, children, right }: { n?: number; title: string; note?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white/90 p-5 shadow-[0_18px_36px_-32px_rgba(11,16,32,0.45)] md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {n !== undefined && <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-brass-light">{n}</span>}
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
          </div>
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function DocEditor({ slug, docId, initial, status, refreshMaster, limitReached, backHref }: {
  slug: string; docId: number | null; initial: DocData; status: Status | null; refreshMaster?: CompanyValues | null; limitReached: boolean; backHref: string;
}) {
  const def = TOOL_DEFS[slug];
  const router = useRouter();
  const [d, setD] = useState<DocData>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<"fill" | "preview">("fill");
  const [tried, setTried] = useState(false);
  const [hsFor, setHsFor] = useState<number | null>(null);
  const locked = status === "final" || status === "cancelled";
  void refreshMaster;

  const ready = useMemo(() => readiness(def, d), [def, d]);
  const view = useMemo(() => buildView(def, d), [def, d]);
  const mres = useMemo(() => (def.matrix ? computeMatrix(def.matrix, d) : null), [def, d]);
  const results = def.results?.(d) ?? [];
  const missing = new Set(ready.missing.map((m) => m.key));

  const setF = (k: string, v: string) => setD((p) => ({ ...p, f: { ...p.f, [k]: v } }));
  const setLine = (i: number, k: string, v: string) => setD((p) => ({ ...p, lines: p.lines.map((r, ri) => (ri === i ? { ...r, [k]: v } : r)) }));
  const setM = (c: string, r: string, v: string) => setD((p) => ({ ...p, m: { ...p.m, [c]: { ...p.m[c], [r]: v } } }));
  const master0 = useMemo(() => ({ defaultCurrency: d.lines[0]?.currency ?? "" }) as unknown as CompanyValues, [d.lines]);

  const run = (fn: () => Promise<void>) => start(async () => { setMsg(null); await fn(); });

  const save = () => run(async () => {
    const r = await saveDocumentAction(docId, slug, d);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok && !docId && r.id) router.replace(`/app/documents/${r.id}`);
    else if (r.ok) router.refresh();
  });
  const finalise = () => run(async () => {
    setTried(true);
    if (!ready.ready) { setMsg({ ok: false, text: "Fill in the required boxes marked in red first." }); return; }
    const s = await saveDocumentAction(docId, slug, d);
    if (!s.ok || !s.id) { setMsg({ ok: false, text: s.message }); return; }
    const r = await finaliseDocumentAction(s.id);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) { if (!docId) router.replace(`/app/documents/${s.id}`); else router.refresh(); }
  });
  const cancel = () => run(async () => {
    if (!docId || !confirm("Cancel this document? It stays in your list marked Cancelled.")) return;
    const r = await cancelDocumentAction(docId);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) router.refresh();
  });
  const copy = (target?: string) => run(async () => {
    if (!docId) return;
    const r = await carryForwardAction(docId, target);
    if (r.ok && r.id) router.push(`/app/documents/${r.id}`);
    else setMsg({ ok: false, text: r.message });
  });
  const refreshCompany = () => run(async () => {
    const co = await masterCompanyAction();
    if (co) { setD((p) => ({ ...p, co })); setMsg({ ok: true, text: "Company details updated from your master profile." }); }
    else setMsg({ ok: false, text: "Could not read your master profile." });
  });
  const jump = (key: string) => {
    setTab("fill");
    setTimeout(() => document.getElementById(key === "__table" ? "items" : `f-${key}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const fieldGrid = (s: Section) => (
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
      {s.fields.map((f) => (
        <label key={f.k} className={`block ${SPAN[f.span ?? 1]}`}>
          <span className="text-xs font-medium text-ink/80">{f.label}{f.req && <span className="text-vermilion"> *</span>}</span>
          <div className="mt-1">
            <Control f={f} value={d.f[f.k] ?? ""} onChange={(v) => setF(f.k, v)} disabled={locked} invalid={tried && missing.has(f.k)} />
          </div>
        </label>
      ))}
    </div>
  );

  const mid = def.sections.length + 1; // number of the table / matrix card
  const hasMid = !!(def.table || def.matrix);
  const sectionCard = (s: Section, i: number, after = false) => (
    <Card key={s.title} n={after ? mid + (hasMid ? 1 : 0) + i : i + 1} title={s.title} note={s.note}>{fieldGrid(s)}</Card>
  );

  const t = def.table;
  const tableCard = t && (
    <div id="items"><Card n={mid} title={t.title} note={t.note} right={
      !t.fixed && !locked ? (
        <button type="button" disabled={d.lines.length >= t.max} onClick={() => setD((p) => ({ ...p, lines: [...p.lines, blankLine(def, master0)] }))} className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-brass disabled:opacity-40">
          <Plus className="size-3.5" /> Add {t.itemLabel.toLowerCase()}
        </button>
      ) : undefined
    }>
      <div className="space-y-3">
        {d.lines.map((r, i) => {
          const used = isUsed(t, r);
          return (
            <div key={i} className={`rounded-xl border p-3.5 ${used ? "border-brass/40 bg-paper/50" : "border-border bg-white"}`}>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{t.fixed ? r[t.cols[0].k] : `${t.itemLabel} ${i + 1}`}</span>
                <span className="flex items-center gap-3">
                  {t.amount && used && <span className="text-xs font-semibold">{r[t.amount.cur ?? ""] ?? ""} {fmt(rowAmount(t, r))}</span>}
                  {!t.fixed && !locked && d.lines.length > t.min && (
                    <button type="button" aria-label="Remove" onClick={() => setD((p) => ({ ...p, lines: p.lines.filter((_, x) => x !== i) }))} className="text-muted-foreground hover:text-vermilion"><Trash2 className="size-4" /></button>
                  )}
                </span>
              </div>
              <div className="grid gap-x-3 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {t.cols.slice(t.fixed ? 1 : 0).map((c) => (
                  <label key={c.k} className={`block ${SPAN[c.span ?? 1]}`}>
                    <span className="flex items-center justify-between text-[11px] font-medium text-ink/70">{c.label}
                      {c.k === "hs" && !locked && <button type="button" onClick={() => setHsFor(i)} className="rounded-full border border-brass/60 px-2 py-0.5 text-[10px] font-medium text-[#9a6f1f] hover:bg-brass/10">Find code</button>}
                    </span>
                    <div className="mt-0.5"><Control f={c} value={r[c.k] ?? ""} onChange={(v) => setLine(i, c.k, v)} disabled={locked} /></div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card></div>
  );

  const mx = def.matrix;
  const matrixCard = mx && mres && (
    <Card n={mid} title={mx.title} note={mx.note}>
      <div className="-mx-2 overflow-x-auto px-2 pb-2">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
          <thead>
            {mx.cols.some((c) => c.group) && (
              <tr>
                <th className="sticky left-0 z-10 bg-white" />
                {mx.cols.map((c, i) => (c.group && mx.cols[i - 1]?.group !== c.group ? (
                  <th key={c.k} colSpan={mx.cols.filter((x) => x.group === c.group).length} className="border-b border-border px-1 pb-1 text-center font-mono text-[10px] uppercase tracking-wider text-[#9a6f1f]">{c.group}</th>
                ) : null))}
              </tr>
            )}
            <tr>
              <th className="sticky left-0 z-10 bg-white min-w-[200px] px-2 py-2 text-left text-xs font-medium text-muted-foreground">Particulars</th>
              {mx.cols.map((c) => (
                <th key={c.k} className="px-1 py-2 text-center text-xs font-medium">
                  {mx.editHeads && !locked ? (
                    <input value={d.heads[c.k] ?? c.label} onChange={(e) => setD((p) => ({ ...p, heads: { ...p.heads, [c.k]: e.target.value } }))} className={`${input} text-center text-xs`} />
                  ) : (d.heads[c.k] || c.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mx.rows.map((r: MRow) =>
              r.kind === "head" ? (
                <tr key={r.k}><td colSpan={mx.cols.length + 1} className="bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-brass-light">{r.label}</td></tr>
              ) : (
                <tr key={r.k} className={r.kind === "calc" ? (r.strong ? "bg-brass/10" : "bg-muted/40") : ""}>
                  <td className={`sticky left-0 z-10 border-b border-border/60 px-2 py-1.5 text-[13px] ${r.strong ? "bg-[#f6efdc] font-semibold" : r.kind === "calc" ? "bg-[#f1efe9] text-ink/80" : "bg-white"}`}>{r.label}</td>
                  {mx.cols.map((c) => (
                    <td key={c.k} className="border-b border-border/60 px-1 py-1">
                      {r.kind === "in" ? (
                        <input inputMode="decimal" disabled={locked} value={d.m[c.k]?.[r.k] ?? ""} onChange={(e) => setM(c.k, r.k, e.target.value)} className={`${input} min-w-[84px] text-right`} />
                      ) : (
                        <div className={`px-2 py-1.5 text-right font-mono text-[13px] ${r.strong ? "font-semibold" : ""}`}>{showCell(mres[c.k][r.k], r)}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const letterCard = def.makeBody && (
    <Card n={mid} title="Letter text" note="Leave this empty to use the standard text, or press the button to copy the standard text here and edit it."
      right={!locked ? <button type="button" onClick={() => setF("body", def.makeBody!(d.f, d.co))} className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-brass"><Wand2 className="size-3.5" /> Write standard text</button> : undefined}>
      <textarea rows={12} disabled={locked} value={d.f.body ?? ""} placeholder={effectiveLetter(def, { ...d, f: { ...d.f, body: "" } })} onChange={(e) => setF("body", e.target.value)} className={`${input} font-sans leading-relaxed`} />
    </Card>
  );

  const statusLabel = status === "final" ? "Active" : status === "cancelled" ? "Cancelled" : "Draft";
  const statusCls = status === "final" ? "border-[#2f7a4a]/40 bg-[#2f7a4a]/10 text-[#2f7a4a]" : status === "cancelled" ? "border-vermilion/40 bg-vermilion/10 text-vermilion" : "border-[#c8963e]/50 bg-[#c8963e]/10 text-[#9a6f1f]";

  return (
    <div>
      {/* top bar */}
      <div className="sticky top-0 z-30 -mx-5 border-b border-border bg-paper/95 px-5 py-3 backdrop-blur md:-mx-0 md:rounded-2xl md:border md:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">← {def.title}</Link>
          <span className={`rounded-full border px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider ${statusCls}`}>{docId ? statusLabel : "New"}</span>
          {!locked && (
            <span className="flex items-center gap-2" title={ready.ready ? "Everything required is filled" : `${ready.missing.length} required box(es) left`}>
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-border"><span className="block h-full rounded-full bg-brass transition-all" style={{ width: `${ready.percent}%` }} /></span>
              <span className="font-mono text-[11px] text-muted-foreground">{ready.percent}% ready</span>
            </span>
          )}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {!locked && (<>
              <button type="button" onClick={save} disabled={pending} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-brass disabled:opacity-50"><Save className="size-4" /> Save draft</button>
              <button type="button" onClick={finalise} disabled={pending || limitReached} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-primary disabled:opacity-50"><Lock className="size-4" /> Finalise</button>
            </>)}
            {status === "final" && (<>
              <a href={`/api/documents/${docId}/pdf`} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-primary"><Download className="size-4" /> Download PDF</a>
              {(def.next ?? []).map((nx) => (
                <button key={nx} type="button" onClick={() => copy(nx)} disabled={pending} className="inline-flex items-center gap-1.5 rounded-full border border-brass/60 bg-brass/10 px-4 py-2 text-sm font-medium hover:bg-brass/20"><ArrowRight className="size-4" /> Make {TOOL_DEFS[nx].title}</button>
              ))}
            </>)}
            {docId && <button type="button" onClick={() => copy()} disabled={pending} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-brass"><Copy className="size-4" /> Duplicate</button>}
            {docId && status !== "cancelled" && <button type="button" onClick={cancel} disabled={pending} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-vermilion hover:border-vermilion/50"><Ban className="size-4" /> Cancel</button>}
          </div>
        </div>
        {(msg || (limitReached && !locked)) && (
          <p role="status" className={`mt-2 flex items-center gap-2 text-sm ${msg?.ok ? "text-[#2f7a4a]" : "text-vermilion"}`}>
            {msg?.ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
            {msg?.text ?? <>Your free document is used. You can still save drafts, but Finalise needs the monthly plan. <Link href="/app/billing" className="font-medium underline underline-offset-4">Upgrade</Link></>}
          </p>
        )}
      </div>

      {hsFor !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 pt-[8vh]" onClick={() => setHsFor(null)} onKeyDown={(e) => e.key === "Escape" && setHsFor(null)}>
          <div className="w-full max-w-3xl rounded-3xl bg-paper p-5 shadow-2xl md:p-6" role="dialog" aria-label="Find HS code" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Find HS code</h2><button type="button" onClick={() => setHsFor(null)} className="rounded-full border border-border bg-white px-3 py-1 text-sm">Close</button></div>
            <Suspense fallback={null}><HsFinder mode="picker" onPick={(code) => { setLine(hsFor, "hs", code); setHsFor(null); }} /></Suspense>
          </div>
        </div>
      )}

      {/* mobile tabs */}
      <div className="mt-4 flex gap-2 xl:hidden">
        {(["fill", "preview"] as const).map((x) => (
          <button key={x} type="button" onClick={() => setTab(x)} className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${tab === x ? "border-ink bg-ink text-paper" : "border-border bg-white"}`}>
            {x === "fill" ? <FileEdit className="size-4" /> : <Eye className="size-4" />} {x === "fill" ? "Fill in" : "Preview"}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_540px]">
        <div className={`space-y-5 ${tab === "preview" ? "hidden xl:block" : ""}`}>
          {locked && <div className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"><Lock className="size-4" /> This document is {status === "final" ? "final" : "cancelled"} and cannot be edited. Use Duplicate to start a copy.</div>}

          {!locked && tried && !ready.ready && (
            <div className="rounded-xl border border-vermilion/40 bg-vermilion/5 p-4 text-sm">
              <p className="font-medium">Still needed before you can finalise:</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {ready.missing.map((m) => <li key={m.key}><button type="button" onClick={() => jump(m.key)} className="rounded-full border border-vermilion/40 bg-white px-3 py-1 text-xs hover:bg-vermilion/10">{m.label}</button></li>)}
              </ul>
            </div>
          )}

          {def.sections.map((x, i) => sectionCard(x, i))}
          {tableCard}
          {matrixCard}
          {(def.after ?? []).map((x, i) => sectionCard(x, i, true))}
          {letterCard}

          {results.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {results.map(([l, v]) => (
                <div key={l} className="rounded-xl border border-brass/40 bg-brass/10 px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#9a6f1f]">{l}</div>
                  <div className="mt-1 text-lg font-semibold">{v}</div>
                </div>
              ))}
            </div>
          )}

          <Card title="Your company on this document" note="Taken from your master profile when this document was created.">
            <p className="text-sm">{d.co.name || <span className="text-vermilion">No company name yet.</span>} <span className="text-muted-foreground">{d.co.address}</span></p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/app/company" className="underline underline-offset-4 hover:text-primary">Edit master profile</Link>
              {!locked && <button type="button" onClick={refreshCompany} className="inline-flex items-center gap-1.5 hover:text-primary"><RefreshCw className="size-3.5" /> Use latest profile details</button>}
            </div>
          </Card>
        </div>

        <aside className={`${tab === "fill" ? "hidden xl:block" : ""}`}>
          <div className="xl:sticky xl:top-24">
            <div className="rounded-2xl border border-border bg-[#e9e5d8] p-3">
              <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><Eye className="size-3.5" /> Live preview — updates as you type</p>
              <Paper view={view} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
