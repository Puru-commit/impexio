"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, Download, Plus, Trash2 } from "lucide-react";
import { finaliseDocumentAction, saveDocumentAction } from "@/app/app/documents/actions";
import { InvoicePreview } from "@/components/app/invoice-preview";
import {
  CURRENCIES, INCOTERMS, UNITS, emptyItem, lineAmount, money, totals,
  type Item, type Proforma,
} from "@/lib/proforma";

const TYPE = "export-proforma-invoice";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brass focus:ring-2 focus:ring-brass/20";

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-white/85 p-5 shadow-[0_20px_40px_-34px_rgba(11,16,32,0.4)] md:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function ProformaEditor({
  docId,
  initial,
  status,
  limitReached,
}: {
  docId: number | null;
  initial: Proforma;
  status: "draft" | "final" | null;
  /** True when the free document is already used and this one is not final. */
  limitReached: boolean;
}) {
  const router = useRouter();
  const [d, setD] = useState<Proforma>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const t = totals(d);
  const isFinal = status === "final";

  // Today's date in the user's own time zone (not UTC).
  const today = () => {
    const n = new Date();
    const p = (x: number) => String(x).padStart(2, "0");
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
  };

  const set = <K extends keyof Proforma>(k: K, v: Proforma[K]) => setD((p) => ({ ...p, [k]: v }));
  const setIn = <G extends "exporter" | "consignee" | "bank">(g: G, k: keyof Proforma[G], v: string) =>
    setD((p) => ({ ...p, [g]: { ...p[g], [k]: v } }));
  const setItem = (n: number, patch: Partial<Item>) =>
    setD((p) => ({ ...p, items: p.items.map((it, i) => (i === n ? { ...it, ...patch } : it)) }));

  const withDate = (): Proforma => (d.date ? d : { ...d, date: today() });

  const save = (): Promise<number | null> =>
    new Promise((resolve) => {
      start(async () => {
        const payload = withDate();
        setD(payload);
        const r = await saveDocumentAction(docId, TYPE, payload);
        setMsg({ ok: r.ok, text: r.message });
        if (r.ok && r.id && !docId) router.replace(`/app/documents/${r.id}`);
        resolve(r.ok ? (r.id ?? null) : null);
      });
    });

  const finalise = () =>
    start(async () => {
      const payload = withDate();
      setD(payload);
      const saved = await saveDocumentAction(docId, TYPE, payload);
      if (!saved.ok || !saved.id) return setMsg({ ok: false, text: saved.message });
      const r = await finaliseDocumentAction(saved.id);
      if (!r.ok) return setMsg({ ok: false, text: r.message });
      setMsg({ ok: true, text: "Final. Your PDF is downloading." });
      const a = document.createElement("a");
      a.href = `/api/documents/${saved.id}/pdf`;
      a.click();
      if (!docId) router.replace(`/app/documents/${saved.id}`);
      else router.refresh();
    });

  const needsCompany = !d.exporter.name.trim();

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">
      <div className="space-y-5">
        {needsCompany && (
          <div className="flex items-start gap-3 rounded-2xl border border-brass/50 bg-brass/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#9a6f1f]" />
            <span>
              Your company details are empty. <Link href="/app/company" className="font-medium text-primary underline-offset-4 hover:underline">Fill in your company profile</Link>, then start a new invoice to have them added automatically.
            </span>
          </div>
        )}

        <Card title="Invoice">
          <Field label="Invoice number"><input className={inputCls} value={d.invoiceNo} onChange={(e) => set("invoiceNo", e.target.value)} placeholder="PI-001" /></Field>
          <Field label="Currency">
            <select className={inputCls} value={d.currency} onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <div className="mt-1.5 flex gap-2">
              <input type="date" className={`${inputCls} mt-0`} value={d.date} onChange={(e) => set("date", e.target.value)} />
              <button type="button" onClick={() => set("date", today())} className="shrink-0 rounded-xl border border-border bg-white px-3 text-sm transition-colors hover:border-brass/60">Today</button>
            </div>
          </Field>
          <Field label="Valid until"><input type="date" className={inputCls} value={d.validUntil} onChange={(e) => set("validUntil", e.target.value)} /></Field>
          <Field label="Buyer reference (optional)" wide><input className={inputCls} value={d.buyerRef} onChange={(e) => set("buyerRef", e.target.value)} /></Field>
        </Card>

        <Card title="Buyer (consignee)">
          <Field wide label="Company name"><input className={inputCls} value={d.consignee.name} onChange={(e) => setIn("consignee", "name", e.target.value)} /></Field>
          <Field wide label="Address"><input className={inputCls} value={d.consignee.address} onChange={(e) => setIn("consignee", "address", e.target.value)} /></Field>
          <Field label="Country"><input className={inputCls} value={d.consignee.country} onChange={(e) => setIn("consignee", "country", e.target.value)} /></Field>
          <Field label="Phone"><input className={inputCls} value={d.consignee.phone} onChange={(e) => setIn("consignee", "phone", e.target.value)} /></Field>
          <Field wide label="Email"><input className={inputCls} value={d.consignee.email} onChange={(e) => setIn("consignee", "email", e.target.value)} /></Field>
        </Card>

        <Card title="Shipment and terms">
          <Field label="Incoterm">
            <select className={inputCls} value={d.incoterm} onChange={(e) => set("incoterm", e.target.value)}>
              {INCOTERMS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Delivery time"><input className={inputCls} value={d.deliveryTime} onChange={(e) => set("deliveryTime", e.target.value)} placeholder="Within 30 days of advance" /></Field>
          <Field label="Port of loading"><input className={inputCls} value={d.portLoading} onChange={(e) => set("portLoading", e.target.value)} /></Field>
          <Field label="Port of discharge"><input className={inputCls} value={d.portDischarge} onChange={(e) => set("portDischarge", e.target.value)} /></Field>
          <Field label="Country of origin"><input className={inputCls} value={d.countryOrigin} onChange={(e) => set("countryOrigin", e.target.value)} /></Field>
          <Field label="Final destination"><input className={inputCls} value={d.countryDestination} onChange={(e) => set("countryDestination", e.target.value)} /></Field>
          <Field wide label="Payment terms"><input className={inputCls} value={d.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)} placeholder="50% advance, balance before shipment" /></Field>
        </Card>

        <section className="rounded-3xl border border-border bg-white/85 p-5 shadow-[0_20px_40px_-34px_rgba(11,16,32,0.4)] md:p-6">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="mt-4 space-y-4">
            {d.items.map((it, n) => (
              <div key={n} className="rounded-2xl border border-border bg-paper/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-muted-foreground">ITEM {n + 1}</p>
                  {d.items.length > 1 && (
                    <button type="button" aria-label={`Remove item ${n + 1}`} onClick={() => set("items", d.items.filter((_, i) => i !== n))} className="rounded-full p-1.5 text-muted-foreground hover:bg-white hover:text-vermilion">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <Field wide label="Description"><input className={inputCls} value={it.description} onChange={(e) => setItem(n, { description: e.target.value })} /></Field>
                  <Field label="HS code"><input className={inputCls} value={it.hsCode} onChange={(e) => setItem(n, { hsCode: e.target.value })} /></Field>
                  <Field label="Unit">
                    <select className={inputCls} value={it.unit} onChange={(e) => setItem(n, { unit: e.target.value })}>
                      {UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </Field>
                  <Field label="Quantity"><input type="number" min="0" step="any" className={inputCls} value={it.qty} onChange={(e) => setItem(n, { qty: Number(e.target.value) })} /></Field>
                  <Field label={`Rate (${d.currency})`}><input type="number" min="0" step="any" className={inputCls} value={it.rate} onChange={(e) => setItem(n, { rate: Number(e.target.value) })} /></Field>
                </div>
                <p className="mt-3 text-right text-sm">Amount: <span className="font-semibold">{money(lineAmount(it))}</span></p>
              </div>
            ))}
          </div>
          {d.items.length < 50 && (
            <button type="button" onClick={() => set("items", [...d.items, emptyItem()])} className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-brass/60">
              <Plus className="size-4" /> Add item
            </button>
          )}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label={`Freight (${d.currency})`}><input type="number" min="0" step="any" className={inputCls} value={d.freight} onChange={(e) => set("freight", Number(e.target.value))} /></Field>
            <Field label={`Insurance (${d.currency})`}><input type="number" min="0" step="any" className={inputCls} value={d.insurance} onChange={(e) => set("insurance", Number(e.target.value))} /></Field>
          </div>
          <p className="mt-5 flex items-center justify-between rounded-2xl bg-ink px-5 py-3 text-paper">
            <span>Total ({d.currency})</span>
            <span className="font-heading text-xl font-semibold text-brass-light">{money(t.total)}</span>
          </p>
        </section>

        <Card title="Notes">
          <Field wide label="Notes (optional)"><textarea rows={3} className={inputCls} value={d.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        </Card>

        <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-paper/95 p-3 backdrop-blur-md">
          <button type="button" disabled={pending} onClick={save} className="rounded-full border border-ink/20 bg-white px-6 py-2.5 text-sm font-medium transition-all hover:border-brass/60 active:scale-[0.98] disabled:opacity-60">
            {pending ? "Working…" : "Save draft"}
          </button>
          {isFinal && docId ? (
            <a href={`/api/documents/${docId}/pdf`} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-all hover:bg-primary">
              <Download className="size-4" /> Download PDF
            </a>
          ) : (
            <button type="button" disabled={pending || limitReached} onClick={finalise} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98] disabled:opacity-50">
              <Download className="size-4" /> Finalise and download PDF
            </button>
          )}
          {limitReached && !isFinal && (
            <span className="text-sm text-vermilion">Your free document is used. Upgrade to finalise more.</span>
          )}
          {msg && (
            <span role="status" className={`flex items-center gap-1.5 text-sm ${msg.ok ? "text-[#2f7a4a]" : "text-vermilion"}`}>
              {msg.ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
              {msg.text}
            </span>
          )}
        </div>
      </div>

      <aside className="xl:sticky xl:top-6 xl:self-start">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Live preview</p>
        <InvoicePreview d={d} />
      </aside>
    </div>
  );
}
