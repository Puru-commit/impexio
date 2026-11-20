import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminGuard, dateTimeIn, inr } from "@/components/admin/admin-guard";
import { listAllPayments } from "@/lib/admin";

export const metadata: Metadata = { title: "Payments — IMPEXIO Admin" };

async function List() {
  const pays = await listAllPayments(200);
  const paid = pays.filter((p) => p.status === "paid");
  const total = paid.reduce((a, p) => a + p.amount, 0);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Admin</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Payments</h1>
      <p className="mt-2 text-sm text-muted-foreground">{paid.length} paid · {inr(total)} in the latest {pays.length} records. “Not completed” means the customer opened the payment window but did not pay.</p>

      {pays.length === 0 ? <p className="mt-8 text-sm text-muted-foreground">No payments yet.</p> : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white/90">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">When</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Payment id</th><th className="px-3 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Status</th></tr></thead>
            <tbody>
              {pays.map((p) => (
                <tr key={`${p.id}-${p.at}`} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{dateTimeIn(p.at)}</td>
                  <td className="px-3 py-3"><Link href={`/app/admin/customers/${p.userId}`} className="underline-offset-4 hover:underline">{p.name || p.email}</Link><div className="text-xs text-muted-foreground">{p.email}</div></td>
                  <td className="px-3 py-3 font-mono text-xs">{p.id}</td><td className="px-3 py-3 text-right font-mono">{inr(p.amount)}</td>
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

export default function Page() {
  return <Suspense fallback={null}><AdminGuard><List /></AdminGuard></Suspense>;
}
