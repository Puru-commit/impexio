import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import type { Item } from "@/lib/marketing";

const GRID = "linear-gradient(rgba(11,16,32,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,16,32,0.05) 1px, transparent 1px)";
const FADE = "radial-gradient(ellipse 75% 70% at 50% 30%, black, transparent 80%)";

export function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] ${dark ? "border-white/15 bg-white/5 text-brass-light" : "border-border bg-white/60 text-[#9a6f1f]"}`}>
      <span className="size-1.5 rounded-full bg-brass" />
      {children}
    </p>
  );
}

export function PageHero({ eyebrow, title, text, actions, aside }: { eyebrow: string; title: React.ReactNode; text: string; actions?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: GRID, backgroundSize: "56px 56px", maskImage: FADE, WebkitMaskImage: FADE }} />
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 size-[460px] rounded-full bg-brass/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-40 size-[380px] rounded-full bg-signal/10 blur-3xl" />
      <div className={`relative mx-auto max-w-6xl px-5 pb-14 pt-14 md:pt-20 ${aside ? "grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]" : "text-center"}`}>
        <div className={aside ? "" : "mx-auto max-w-3xl"}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] md:text-6xl">{title}</h1>
          <p className={`mt-6 text-lg text-muted-foreground ${aside ? "max-w-xl" : "mx-auto max-w-2xl"}`}>{text}</p>
          {actions && <div className={`mt-8 flex flex-wrap gap-3 ${aside ? "" : "justify-center"}`}>{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function Gradient({ children }: { children: React.ReactNode }) {
  return <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">{children}</span>;
}

export function Btn({ href, children, variant = "dark" }: { href: string; children: React.ReactNode; variant?: "dark" | "light" | "brass" }) {
  const c = {
    dark: "bg-ink text-paper hover:bg-primary",
    light: "border border-ink/20 bg-white/70 text-foreground hover:border-brass/60 hover:bg-white",
    brass: "bg-brass-light text-ink hover:bg-brass",
  }[variant];
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all active:scale-[0.98] ${c}`}>
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SectionHead({ eyebrow, title, text, center }: { eyebrow: string; title: React.ReactNode; text?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
    </Reveal>
  );
}

export function ItemGrid({ items, cols = 3 }: { items: (Item & { href?: string })[]; cols?: 3 | 4 }) {
  return (
    <ul className={`mt-10 grid gap-4 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((it, i) => {
        const inner = (
          <>
            <div className="flex items-start justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-brass-light transition-transform group-hover:-rotate-6 group-hover:scale-105"><it.icon className="size-6" /></span>
              {it.tag && <span className="rounded-full border border-border bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{it.tag}</span>}
            </div>
            <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
          </>
        );
        const cls = "group relative block h-full rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-brass/60 hover:shadow-[0_24px_50px_-30px_rgba(11,16,32,0.5)]";
        return (
          <li key={it.title}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              {it.href ? <Link href={it.href} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>}
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

export function CtaBand({ title, text, primary = { href: "/register", label: "Start free" }, secondary }: { title: string; text: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="px-5 pb-20 pt-6">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-ink p-10 text-paper md:p-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[360px] rounded-full bg-brass/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-10 size-[300px] rounded-full bg-signal/25 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-paper/70">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={primary.href} variant="brass">{primary.label}</Btn>
            {secondary && <Link href={secondary.href} className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10">{secondary.label}</Link>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
