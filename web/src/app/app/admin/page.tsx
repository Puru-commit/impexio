import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getStats, isAdmin, listAllPayments, listUsers } from "@/lib/admin";
import { currentUserId } from "@/lib/session";
import { UsersTable } from "./users-table";

export const metadata: Metadata = { title: "Admin panel — IMPEXIO" };

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

async function Content() {
  await connection();
  const me = await currentUserId();
  if (!me) return null;

  let ok = false;
  try {
    ok = await isAdmin(me);
  } catch {
    return <div className="mx-auto max-w-3xl px-5 py-14"><div className="flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" /> Could not reach the database. Start Laragon and refresh.</div></div>;
  }
  if (!ok) notFound(); // Normal users never learn this page exists.

  const [stats, users, pays] = await Promise.all([getStats(), listUsers(), listAllPayments()]);

  const days = stats.signups;
  const maxDay = Math.max(1, ...days.map((x) => x.n));

  const tiles: [string, string, string?][] = [
    ["Customers", String(stats.users), `${stats.usersWeek} new this week`],
    ["Paying now", String(stats.paidUsers), `${stats.freeUsers} on free`],
    ["Plans ending in 7 days", String(stats.endingSoon), "follow up with them"],
    ["Revenue this month", inr(stats.revenueMonth)],
    ["Revenue all time", inr(stats.revenue)],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Admin panel</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Business overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">Only you can see this page. You see who your customers are and what they pay. Their documents are never shown here.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {tiles.map(([l, v, sub]) => (
          <div key={l} className="rounded-2xl border border-border bg-white/85 px-4 py-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-1 text-2xl font-semibold">{v}</div>
            {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-3xl border border-border bg-white/85 p-6">
        <h2 className="text-base font-semibold">New customers, last 14 days</h2>
        <div className="mt-5 flex h-32 items-end gap-1.5" role="img" aria-label="New customers per day">
          {days.map((x) => (
            <div key={x.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${x.d}: ${x.n}`}>
              <span className="font-mono text-[10px] text-muted-foreground">{x.n || ""}</span>
              <div className="w-full rounded-t bg-brass" style={{ height: `${Math.max(x.n ? 6 : 2, (x.n / maxDay) * 100)}%`, opacity: x.n ? 1 : 0.25 }} />
              <span className="font-mono text-[9px] text-muted-foreground">{x.d.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-10 text-lg font-semibold">Customers</h2>
      <div className="mt-4"><UsersTable users={users} /></div>

      <h2 className="mt-10 text-lg font-semibold">Recent payments</h2>
      {pays.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No payments yet.</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white/90">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">When</th><th className="px-3 py-3">User</th><th className="px-3 py-3">Payment id</th><th className="px-3 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Status</th></tr></thead>
            <tbody>
              {pays.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{when(p.at)}</td><td className="px-3 py-3">{p.email}</td><td className="px-3 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-3 py-3 text-right font-mono">{inr(p.amount)}</td>
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
  return <Suspense fallback={null}><Content /></Suspense>;
}
