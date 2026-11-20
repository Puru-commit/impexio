import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminGuard, dateIn, inr } from "@/components/admin/admin-guard";
import { getStats, listUsers } from "@/lib/admin";
import { findTool } from "@/lib/tools";

export const metadata: Metadata = { title: "Admin overview — IMPEXIO" };

async function Overview() {
  const [stats, users] = await Promise.all([getStats(), listUsers(500)]);
  const maxDay = Math.max(1, ...stats.signups.map((x) => x.n));
  const maxTool = Math.max(1, ...stats.byTool.map((x) => x.n));
  const docsTotal = stats.docs.draft + stats.docs.final + stats.docs.cancelled;
  const recent = users.slice(0, 6);
  const ending = users.filter((u) => u.endingSoon).sort((a, b) => a.paidUntil.localeCompare(b.paidUntil)).slice(0, 8);

  const tiles: [string, string, string?][] = [
    ["Customers", String(stats.users), `${stats.usersWeek} new this week`],
    ["Logged in this week", String(stats.activeWeek)],
    ["Paying now", String(stats.paidUsers), `${stats.freeUsers} on free`],
    ["Plans ending in 7 days", String(stats.endingSoon), "follow up with them"],
    ["Revenue this month", inr(stats.revenueMonth)],
    ["Revenue all time", inr(stats.revenue), `${stats.payments} payments`],
    ["Documents made", String(docsTotal), `${stats.docs.final} active · ${stats.docs.draft} draft · ${stats.docs.cancelled} cancelled`],
    ["No company profile", String(stats.noProfile), "have not filled it in"],
    ["No documents yet", String(stats.noDocs), "signed up, never created one"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Admin</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Business overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">Only you can see this. You see who your customers are and what they pay. The contents of their documents are never shown.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {tiles.map(([l, v, sub]) => (
          <div key={l} className="rounded-2xl border border-border bg-white/85 px-4 py-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-1 text-2xl font-semibold">{v}</div>
            {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-white/85 p-6">
          <h2 className="text-base font-semibold">New customers, last 14 days</h2>
          <div className="mt-5 flex h-36 items-end gap-1.5" role="img" aria-label="New customers per day">
            {stats.signups.map((x) => (
              <div key={x.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${x.d}: ${x.n}`}>
                <span className="font-mono text-[10px] text-muted-foreground">{x.n || ""}</span>
                <div className="w-full rounded-t bg-brass" style={{ height: `${Math.max(x.n ? 6 : 2, (x.n / maxDay) * 100)}%`, opacity: x.n ? 1 : 0.25 }} />
                <span className="font-mono text-[9px] text-muted-foreground">{x.d.slice(8)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white/85 p-6">
          <h2 className="text-base font-semibold">Which tools customers use</h2>
          {stats.byTool.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No documents yet.</p> : (
            <ul className="mt-4 space-y-2.5">
              {stats.byTool.map((t) => (
                <li key={t.slug} className="text-sm">
                  <div className="flex justify-between"><span>{findTool(t.slug)?.tool.title ?? t.slug}</span><span className="font-mono">{t.n}</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-ink" style={{ width: `${(t.n / maxTool) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-white/85 p-6">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">Newest customers</h2><Link href="/app/admin/customers" className="text-sm underline underline-offset-4">See all</Link></div>
          <ul className="mt-4 divide-y divide-border/60">
            {recent.length === 0 && <li className="py-3 text-sm text-muted-foreground">No customers yet.</li>}
            {recent.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><Link href={`/app/admin/customers/${u.id}`} className="font-medium underline-offset-4 hover:underline">{u.name || u.email}</Link><div className="truncate text-xs text-muted-foreground">{u.company || u.email}</div></div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">{dateIn(u.joined)}<div>{u.plan === "paid" ? "Paid" : "Free"}</div></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-white/85 p-6">
          <h2 className="text-base font-semibold">Plans ending soon</h2>
          <ul className="mt-4 divide-y divide-border/60">
            {ending.length === 0 && <li className="py-3 text-sm text-muted-foreground">No paid plan ends in the next 7 days.</li>}
            {ending.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><Link href={`/app/admin/customers/${u.id}`} className="font-medium underline-offset-4 hover:underline">{u.name || u.email}</Link><div className="truncate text-xs text-muted-foreground">{u.phone || u.email}</div></div>
                <div className="shrink-0 text-xs text-[#9a6f1f]">Ends {dateIn(u.paidUntil)}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><AdminGuard><Overview /></AdminGuard></Suspense>;
}
