"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarClock, Check, Gift, ListChecks, Lock, Search, TriangleAlert, X } from "lucide-react";
import { GOALS, INCENTIVES_AS_OF, SCHEMES } from "@/lib/marketing";

const KEY = "impexio_incentive_views";

function seen(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function remember(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

export function IncentiveExplorer({ signedIn }: { signedIn: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [goal, setGoal] = useState("");
  const [q, setQ] = useState("");
  const [gate, setGate] = useState(false);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return SCHEMES.filter((s) => (!goal || s.goals.includes(goal)) && (!t || `${s.name} ${s.full} ${s.short} ${s.what}`.toLowerCase().includes(t)));
  }, [goal, q]);

  useEffect(() => {
    if (!gate) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setGate(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [gate]);

  function open(id: string) {
    if (signedIn) { setActive(id); return; }
    const ids = seen();
    if (ids.includes(id)) { setActive(id); return; }
    if (ids.length >= 1) { setGate(true); return; }
    remember([...ids, id]);
    setActive(id);
  }

  const s = SCHEMES.find((x) => x.id === active);

  return (
    <div>
      {/* finder */}
      <div className="rounded-3xl border border-border bg-white p-4 shadow-[0_30px_60px_-45px_rgba(11,16,32,0.5)] md:p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-paper px-4 focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/15">
          <Search className="size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a scheme: drawback, machinery, garments…" aria-label="Search schemes" className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setGoal("")} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${!goal ? "border-ink bg-ink text-paper" : "border-border hover:border-brass"}`}>All schemes</button>
          {GOALS.map((g) => (
            <button key={g.id} type="button" onClick={() => setGoal(goal === g.id ? "" : g.id)} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${goal === g.id ? "border-ink bg-ink text-paper" : "border-border hover:border-brass"}`}>{g.label}</button>
          ))}
        </div>
      </div>

      {/* scheme cards */}
      {list.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">No scheme matches that. Try another word or clear the filter.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((x) => (
            <li key={x.id}>
              <button type="button" onClick={() => open(x.id)} aria-pressed={active === x.id}
                className={`group h-full w-full rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${active === x.id ? "border-ink bg-ink text-paper shadow-[0_24px_50px_-30px_rgba(11,16,32,0.8)]" : "border-border bg-white hover:border-brass/60"}`}>
                <span className={`flex size-10 items-center justify-center rounded-lg ${active === x.id ? "bg-brass-light text-ink" : "bg-ink text-brass-light"}`}><x.icon className="size-5" /></span>
                <span className="mt-4 block text-lg font-semibold">{x.name}</span>
                <span className={`mt-1 block text-sm leading-snug ${active === x.id ? "text-paper/70" : "text-muted-foreground"}`}>{x.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* detail */}
      <AnimatePresence mode="wait">
        {s ? (
          <motion.article key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-6 overflow-hidden rounded-3xl border border-border bg-white">
            <header className="flex flex-wrap items-center gap-4 border-b border-border bg-paper p-6 md:p-8">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-ink text-brass-light"><s.icon className="size-7" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-semibold md:text-3xl">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.full}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 font-mono text-xs text-muted-foreground"><CalendarClock className="size-3.5" />As of {INCENTIVES_AS_OF}</span>
            </header>
            <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
              <div className="space-y-6">
                <section><h4 className="font-mono text-xs uppercase tracking-[0.18em] text-[#9a6f1f]">What it is</h4><p className="mt-2 leading-relaxed">{s.what}</p></section>
                <section><h4 className="font-mono text-xs uppercase tracking-[0.18em] text-[#9a6f1f]">Who it is for</h4><p className="mt-2 leading-relaxed">{s.who}</p></section>
                <section>
                  <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-[#9a6f1f]">How it helps you</h4>
                  <ul className="mt-3 space-y-2.5">{s.benefit.map((b) => (<li key={b} className="flex gap-2.5"><Check className="mt-1 size-4 shrink-0 text-[#9a6f1f]" />{b}</li>))}</ul>
                </section>
              </div>
              <div className="space-y-6">
                <section>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#9a6f1f]"><ListChecks className="size-4" />How to use it</h4>
                  <ol className="mt-3 space-y-3">{s.how.map((h, n) => (<li key={h} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-paper">{n + 1}</span>{h}</li>))}</ol>
                </section>
                <section className="rounded-2xl border border-brass/40 bg-brass/10 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold"><TriangleAlert className="size-4 text-[#9a6f1f]" />Check before you rely on it</h4>
                  <p className="mt-1.5 text-sm leading-relaxed">{s.watch}</p>
                </section>
                <a href={s.source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline">Official source: {s.source.label}<ArrowUpRight className="size-4" /></a>
              </div>
            </div>
          </motion.article>
        ) : (
          <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">Pick a scheme above to see what it is, who it is for and how to use it.</motion.p>
        )}
      </AnimatePresence>

      {/* sign-in popup */}
      <AnimatePresence>
        {gate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm" onClick={() => setGate(false)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="gate-title" initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-brass/30 blur-3xl" />
              <button type="button" onClick={() => setGate(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 hover:bg-secondary"><X className="size-5" /></button>
              <span className="relative flex size-14 items-center justify-center rounded-2xl bg-ink text-brass-light"><Gift className="size-7" /></span>
              <h3 id="gate-title" className="relative mt-5 text-2xl font-semibold">Keep exploring, free.</h3>
              <p className="relative mt-3 text-muted-foreground">You have used your free look. Create a free account to open every scheme, and get a free HS Code Finder and one free document too.</p>
              <ul className="relative mt-5 space-y-2 text-sm">
                {["All 8 incentive schemes, always free", "AI HS Code Finder", "1 free document generation"].map((t) => (<li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 text-[#9a6f1f]" />{t}</li>))}
              </ul>
              <Link href="/register" className="relative mt-7 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-medium text-paper transition-colors hover:bg-primary"><Lock className="size-4" />Sign up free</Link>
              <p className="relative mt-4 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Log in</Link></p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
