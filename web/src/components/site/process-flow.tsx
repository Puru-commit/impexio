"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FileText, Plane, Ship } from "lucide-react";
import { EXPORT_STEPS, IMPORT_STEPS } from "@/lib/marketing";

/** An animated route: pick or let it play through each step of the trade process. */
export function ProcessFlow({ kind }: { kind: "export" | "import" }) {
  const steps = kind === "export" ? EXPORT_STEPS : IMPORT_STEPS;
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold || reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % steps.length), 5200);
    return () => clearInterval(t);
  }, [hold, reduce, steps.length]);

  const s = steps[i];
  const pct = (i / (steps.length - 1)) * 100;
  const ends = kind === "export" ? ["India", "Buyer abroad"] : ["Supplier abroad", "India"];

  return (
    <div onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-paper shadow-[0_50px_100px_-50px_rgba(11,16,32,0.8)] md:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[340px] rounded-full bg-brass/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-10 size-[320px] rounded-full bg-signal/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* route track */}
      <div className="relative">
        <div className="mb-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-paper/50">
          <span>{ends[0]}</span><span>{ends[1]}</span>
        </div>
        <div className="relative mx-3 h-12">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-white/25" />
          <motion.div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-brass to-brass-light" animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeInOut" }} />
          {steps.map((st, n) => (
            <button key={st.title} type="button" aria-label={`Step ${n + 1}: ${st.title}`} onClick={() => setI(n)}
              className={`absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all ${n <= i ? "border-brass-light bg-brass-light" : "border-white/35 bg-ink"} ${n === i ? "scale-125" : ""}`}
              style={{ left: `${(n / (steps.length - 1)) * 100}%` }} />
          ))}
          <motion.div className="absolute top-1/2 -translate-x-1/2 -translate-y-[170%] text-brass-light" animate={{ left: `${pct}%` }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <motion.div animate={reduce ? undefined : { y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
              {i === 5 || i === 6 ? <Ship className="size-6" /> : <Plane className="size-6 rotate-45" />}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* step list */}
        <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
          {steps.map((st, n) => (
            <li key={st.title}>
              <button type="button" onClick={() => setI(n)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${n === i ? "bg-white/10 text-paper" : "text-paper/55 hover:bg-white/5 hover:text-paper"}`}>
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs ${n === i ? "bg-brass-light text-ink" : "border border-white/25"}`}>{n + 1}</span>
                {st.title}
              </button>
            </li>
          ))}
        </ol>

        {/* active step */}
        <div className="min-h-[300px] rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brass-light text-ink"><s.icon className="size-7" /></span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">Step {i + 1} of {steps.length}</p>
                  <h3 className="text-2xl font-semibold">{s.title}</h3>
                </div>
              </div>
              <p className="mt-5 leading-relaxed text-paper/75">{s.text}</p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-paper/50">Documents and papers</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {s.docs.map((d) => (
                  <li key={d} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm"><FileText className="size-3.5 text-brass-light" />{d}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
          {/* progress bar for auto-play */}
          <div className="mt-6 h-0.5 overflow-hidden rounded-full bg-white/10">
            <motion.div key={`${i}-${hold}`} className="h-full bg-brass-light" initial={{ width: 0 }} animate={{ width: hold || reduce ? 0 : "100%" }} transition={{ duration: hold || reduce ? 0 : 5.2, ease: "linear" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
