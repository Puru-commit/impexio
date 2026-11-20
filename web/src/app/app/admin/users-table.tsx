"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { AdminUser } from "@/lib/admin";
import { adminUserAction } from "./actions";

const d = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "—");

export function UsersTable({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<"all" | "paid" | "free">("all");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return users.filter((u) => (plan === "all" || u.plan === plan) && (!n || `${u.name} ${u.email}`.toLowerCase().includes(n)));
  }, [users, q, plan]);

  const act = (id: number, a: "grant" | "revoke" | "reset", confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return;
    start(async () => {
      const r = await adminUserAction(id, a);
      setMsg(r.message);
      if (r.ok) router.refresh();
    });
  };
  const btn = "rounded-full border border-border bg-white px-3 py-1 text-xs font-medium hover:border-brass disabled:opacity-50";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brass focus:ring-2 focus:ring-brass/20" />
        </label>
        {(["all", "paid", "free"] as const).map((x) => (
          <button key={x} type="button" onClick={() => setPlan(x)} className={`rounded-full border px-3.5 py-2 text-xs font-medium capitalize ${plan === x ? "border-ink bg-ink text-paper" : "border-border bg-white hover:border-brass"}`}>{x}</button>
        ))}
      </div>
      {msg && <p role="status" className="mt-3 text-sm text-[#2f7a4a]">{msg}</p>}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white/90">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">User</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3">Last login</th><th className="px-3 py-3">Plan</th><th className="px-3 py-3 text-right">Docs</th><th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No users match.</td></tr>}
            {shown.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3"><div className="font-medium">{u.name || "—"} {u.role === "admin" && <span className="ml-1 rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] uppercase text-brass-light">admin</span>}</div><div className="text-xs text-muted-foreground">{u.email}</div></td>
                <td className="px-3 py-3 text-muted-foreground">{d(u.joined)}</td>
                <td className="px-3 py-3 text-muted-foreground">{d(u.lastLogin)}</td>
                <td className="px-3 py-3">{u.plan === "paid" ? <span className="text-[#2f7a4a]">Paid until {d(u.paidUntil)}</span> : <span className="text-muted-foreground">Free ({u.freeUsed} used)</span>}</td>
                <td className="px-3 py-3 text-right font-mono">{u.docs}</td>
                <td className="px-4 py-3"><div className="flex justify-end gap-1.5">
                  <button type="button" disabled={pending} onClick={() => act(u.id, "grant", `Give ${u.email} 30 more days?`)} className={btn}>+30 days</button>
                  {u.plan === "paid" && <button type="button" disabled={pending} onClick={() => act(u.id, "revoke", `Remove the paid plan for ${u.email}?`)} className={`${btn} text-vermilion`}>Remove plan</button>}
                  <button type="button" disabled={pending} onClick={() => act(u.id, "reset")} className={btn}>Reset free doc</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
