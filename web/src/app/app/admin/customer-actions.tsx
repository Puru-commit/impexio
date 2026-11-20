"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminUserAction } from "./actions";

export function CustomerActions({ id, email, paid, compact }: { id: number; email: string; paid: boolean; compact?: boolean }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  const act = (a: "grant" | "revoke" | "reset", ask?: string) => {
    if (ask && !confirm(ask)) return;
    start(async () => {
      const r = await adminUserAction(id, a);
      setMsg(r.message);
      if (r.ok) router.refresh();
    });
  };
  const btn = `rounded-full border border-border bg-white font-medium hover:border-brass disabled:opacity-50 ${compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`;
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "justify-end" : ""}`}>
      <button type="button" disabled={pending} onClick={() => act("grant", `Give ${email} 30 more days?`)} className={btn}>+30 days</button>
      {paid && <button type="button" disabled={pending} onClick={() => act("revoke", `Remove the paid plan for ${email}?`)} className={`${btn} text-vermilion`}>Remove plan</button>}
      <button type="button" disabled={pending} onClick={() => act("reset")} className={btn}>Reset free doc</button>
      {msg && !compact && <span role="status" className="ml-2 text-sm text-[#2f7a4a]">{msg}</span>}
    </div>
  );
}
