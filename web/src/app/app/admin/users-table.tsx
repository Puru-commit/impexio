"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { AdminUser } from "@/lib/admin";
import { CustomerActions } from "./customer-actions";

const d = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "—");
const FILTERS = [["all", "All"], ["paid", "Paid"], ["free", "Free"], ["ending", "Ending in 7 days"], ["nodocs", "No documents yet"]] as const;

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof FILTERS)[number][0]>("all");

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    const ok = (u: AdminUser) => f === "all" || (f === "ending" ? u.endingSoon : f === "nodocs" ? u.docs === 0 : u.plan === f);
    return users.filter((u) => ok(u) && (!n || `${u.name} ${u.email} ${u.company} ${u.phone} ${u.country} ${u.city}`.toLowerCase().includes(n)));
  }, [users, q, f]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, company, phone, country…" className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(([k, label]) => (
            <button key={k} type="button" onClick={() => setF(k)} className={`rounded-full border px-3.5 py-2 text-xs font-medium ${f === k ? "border-ink bg-ink text-paper" : "border-border bg-white hover:border-brass"}`}>{label}</button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{shown.length} of {users.length} customers</p>
      <div className="mt-2 overflow-x-auto rounded-2xl border border-border bg-white/90">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Customer</th><th className="px-3 py-3">Company / phone</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3">Last login</th>
              <th className="px-3 py-3">Plan</th><th className="px-3 py-3 text-right">Paid so far</th><th className="px-3 py-3 text-right">Docs</th><th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No customers match.</td></tr>}
            {shown.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-brass/5">
                <td className="px-4 py-3">
                  <Link href={`/app/admin/customers/${u.id}`} className="font-medium underline-offset-4 hover:underline">{u.name || "—"}</Link>
                  {u.role === "admin" && <span className="ml-1.5 rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] uppercase text-brass-light">admin</span>}
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="px-3 py-3"><div>{u.company || "—"}</div><div className="text-xs text-muted-foreground">{u.phone}</div></td>
                <td className="px-3 py-3 text-muted-foreground">{[u.city, u.country].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-3 py-3 text-muted-foreground">{d(u.joined)}</td>
                <td className="px-3 py-3 text-muted-foreground">{d(u.lastLogin)}</td>
                <td className="px-3 py-3">{u.plan === "paid" ? <span className={u.endingSoon ? "text-[#9a6f1f]" : "text-[#2f7a4a]"}>Paid until {d(u.paidUntil)}</span> : <span className="text-muted-foreground">Free ({u.freeUsed} used)</span>}</td>
                <td className="px-3 py-3 text-right font-mono">₹{u.paidTotal.toLocaleString("en-IN")}</td>
                <td className="px-3 py-3 text-right font-mono">{u.docs}</td>
                <td className="px-4 py-3"><CustomerActions compact id={u.id} email={u.email} paid={u.plan === "paid"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
