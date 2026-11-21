import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/marketing";
import { Reveal } from "./reveal";

export function PlanCards() {
  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((p, i) => (
        <li key={p.id} className={p.highlight ? "lg:-mt-4" : ""}>
          <Reveal delay={i * 0.07} className="h-full">
            <div className={`relative flex h-full flex-col rounded-3xl border p-7 ${p.highlight ? "border-ink bg-ink text-paper shadow-[0_40px_80px_-40px_rgba(11,16,32,0.8)]" : "border-border bg-white"}`}>
              {p.badge && (
                <span className={`absolute -top-3 left-7 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${p.highlight ? "bg-brass-light text-ink" : "bg-ink text-paper"}`}>{p.badge}</span>
              )}
              <span className={`flex size-11 items-center justify-center rounded-xl ${p.highlight ? "bg-brass-light text-ink" : "bg-ink text-brass-light"}`}><p.icon className="size-5" /></span>
              <h3 className="mt-5 text-xl font-semibold">{p.name}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-5xl font-semibold">{p.price}</span>
                <span className={`text-sm ${p.highlight ? "text-paper/60" : "text-muted-foreground"}`}>{p.per}</span>
              </p>
              <p className={`mt-3 text-sm ${p.highlight ? "text-paper/70" : "text-muted-foreground"}`}>{p.note}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5"><Check className={`mt-0.5 size-4 shrink-0 ${p.highlight ? "text-brass-light" : "text-[#9a6f1f]"}`} />{f}</li>
                ))}
              </ul>
              <Link href="/register" className={`mt-8 block rounded-full py-3 text-center text-sm font-medium transition-all active:scale-[0.98] ${p.highlight ? "bg-brass-light text-ink hover:bg-brass" : "bg-ink text-paper hover:bg-primary"}`}>{p.cta}</Link>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
