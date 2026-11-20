import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminGuard, dateIn, dateTimeIn, inr } from "@/components/admin/admin-guard";
import { getCustomer } from "@/lib/admin";
import { findTool } from "@/lib/tools";
import { CustomerActions } from "../../customer-actions";

export const metadata: Metadata = { title: "Customer — IMPEXIO Admin" };

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCustomer(Number(id));
  if (!c) notFound();
  const { user: u, company: co } = c;

  const tools = new Map<string, { final: number; draft: number; cancelled: number }>();
  for (const r of c.docsByTool) {
    const t = tools.get(r.slug) ?? { final: 0, draft: 0, cancelled: 0 };
    if (r.status === "final" || r.status === "draft" || r.status === "cancelled") t[r.status] += r.n;
    tools.set(r.slug, t);
  }
  const info: [string, string][] = [
    ["Company", u.company], ["Phone", u.phone], ["Company email", co.email], ["Website", co.website],
    ["Address", [co.address, u.city, co.state, co.pincode, u.country].filter(Boolean).join(", ")], ["GSTIN", co.gstin], ["IEC", co.iec],
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <Link href="/app/admin/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All customers</Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {u.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.image} alt="" referrerPolicy="no-referrer" className="size-14 rounded-full" />
          ) : <span className="flex size-14 items-center justify-center rounded-full bg-ink text-xl text-brass-light">{(u.name || u.email).charAt(0).toUpperCase()}</span>}
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">{u.name || u.email}</h1>
            <p className="text-sm text-muted-foreground">{u.email}</p>
          </div>
        </div>
        <CustomerActions id={u.id} email={u.email} paid={u.plan === "paid"} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {([
          ["Plan", u.plan === "paid" ? `Paid until ${dateIn(u.paidUntil)}` : `Free (${u.freeUsed} used)`],
          ["Paid so far", inr(u.paidTotal)],
          ["Joined", dateIn(u.joined)],
          ["Last login", dateTimeIn(u.lastLogin)],
          ["Documents", `${u.docs} (${u.finalDocs} active)`],
          ["Last document", dateTimeIn(c.lastDoc)],
        ] as [string, string][]).map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-border bg-white/85 px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-1 text-sm font-semibold">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-border bg-white/85 p-6">
          <h2 className="text-base font-semibold">Company details</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            {info.map(([l, v]) => (
              <div key={l} className="flex gap-3"><dt className="w-28 shrink-0 text-muted-foreground">{l}</dt><dd className="min-w-0 break-words">{v || "—"}</dd></div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-white/85 p-6">
          <h2 className="text-base font-semibold">Tools they use</h2>
          {tools.size === 0 ? <p className="mt-4 text-sm text-muted-foreground">No documents yet.</p> : (
            <ul className="mt-4 divide-y divide-border/60 text-sm">
              {[...tools].map(([slug, t]) => (
                <li key={slug} className="flex items-center justify-between gap-3 py-2">
                  <span>{findTool(slug)?.tool.title ?? slug}</span>
                  <span className="font-mono text-xs text-muted-foreground">{t.final} active · {t.draft} draft · {t.cancelled} cancelled</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Payments</h2>
      {c.payments.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No payments yet.</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white/90">
          <table className="w-full min-w-[480px] text-sm">
            <thead><tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">When</th><th className="px-3 py-3">Payment id</th><th className="px-3 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Status</th></tr></thead>
            <tbody>
              {c.payments.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{dateTimeIn(p.at)}</td><td className="px-3 py-3 font-mono text-xs">{p.id}</td><td className="px-3 py-3 text-right font-mono">{inr(p.amount)}</td>
                  <td className="px-4 py-3 text-right"><span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase ${p.status === "paid" ? "border-[#2f7a4a]/40 text-[#2f7a4a]" : "border-border text-muted-foreground"}`}>{p.status === "paid" ? "Paid" : "Not completed"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={null}><AdminGuard><Detail params={params} /></AdminGuard></Suspense>;
}
