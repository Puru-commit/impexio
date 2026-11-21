"use client";

import { motion, useReducedMotion } from "motion/react";
import { FileText, Landmark, Search } from "lucide-react";
import { Btn, Eyebrow, Gradient } from "./blocks";

const HUB = { x: 120, y: 250 };
const DEST = [
  { n: "UAE", x: 250, y: 190 },
  { n: "Europe", x: 330, y: 60 },
  { n: "USA", x: 520, y: 120 },
  { n: "Africa", x: 330, y: 360 },
  { n: "Asia-Pacific", x: 540, y: 320 },
];
const arc = (d: { x: number; y: number }) => `M${HUB.x} ${HUB.y} Q ${(HUB.x + d.x) / 2} ${Math.min(HUB.y, d.y) - 70} ${d.x} ${d.y}`;

function Chip({ className, delay, icon, children }: { className: string; delay: number; icon: React.ReactNode; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={`absolute flex items-center gap-2.5 rounded-xl border border-border bg-white/95 px-3.5 py-2.5 text-sm font-medium shadow-[0_14px_36px_-14px_rgba(11,16,32,0.3)] backdrop-blur ${className}`}
      initial={{ opacity: 0, y: 14 }} animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -7, 0] }}
      transition={reduce ? { duration: 0 } : { opacity: { duration: 0.6, delay }, y: { duration: 5, delay, repeat: Infinity, ease: "easeInOut" } }}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-ink text-brass-light">{icon}</span>{children}
    </motion.div>
  );
}

export function HomeHero() {
  const GRID = "linear-gradient(rgba(11,16,32,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,16,32,0.05) 1px, transparent 1px)";
  const FADE = "radial-gradient(ellipse 80% 75% at 55% 40%, black, transparent 80%)";
  return (
    <section className="relative overflow-hidden bg-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: GRID, backgroundSize: "56px 56px", maskImage: FADE, WebkitMaskImage: FADE }} />
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 size-[520px] rounded-full bg-brass/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 size-[420px] rounded-full bg-signal/12 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:pt-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><Eyebrow>Global Trade Simplified</Eyebrow></motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="mt-6 text-5xl font-semibold leading-[1.04] md:text-7xl">
            Export and import, <Gradient>without the paperwork pain.</Gradient>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="mt-6 max-w-xl text-lg text-muted-foreground">
            Find the HS code, work out your price, prepare every document and claim every incentive. One simple workspace for Indian exporters and importers.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }} className="mt-8 flex flex-wrap gap-3">
            <Btn href="/register">Start free</Btn>
            <Btn href="/hs-code-finder" variant="light">Try the HS Code Finder</Btn>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5 text-sm text-muted-foreground">Free trial includes the AI HS Code Finder and 1 document. No card needed.</motion.p>
        </div>

        <div className="relative mx-auto aspect-[640/440] w-full max-w-[640px]">
          <svg viewBox="0 0 640 440" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <radialGradient id="hubg"><stop offset="0" stopColor="#e8b94f" stopOpacity="0.55" /><stop offset="1" stopColor="#e8b94f" stopOpacity="0" /></radialGradient>
            </defs>
            <circle cx="320" cy="220" r="200" fill="none" stroke="rgba(11,16,32,0.08)" strokeDasharray="2 8" />
            <circle cx="320" cy="220" r="140" fill="none" stroke="rgba(11,16,32,0.06)" strokeDasharray="2 8" />
            {DEST.map((d, i) => (
              <g key={d.n}>
                <path id={`r${i}`} d={arc(d)} fill="none" stroke="#c8963e" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="5 6">
                  <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.6s" repeatCount="indefinite" />
                </path>
                <circle r="4.5" fill="#0b1020"><animateMotion dur={`${3.6 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}><mpath href={`#r${i}`} /></animateMotion></circle>
                <circle cx={d.x} cy={d.y} r="14" fill="url(#hubg)" />
                <circle cx={d.x} cy={d.y} r="6" fill="#fff" stroke="#0b1020" strokeWidth="2" />
                <text x={d.x} y={d.y + 26} textAnchor="middle" fontSize="12" fill="#5b6275" fontFamily="var(--font-jetbrains)">{d.n}</text>
              </g>
            ))}
            <circle cx={HUB.x} cy={HUB.y} r="38" fill="url(#hubg)" />
            <circle cx={HUB.x} cy={HUB.y} r="11" fill="#0b1020" />
            <circle cx={HUB.x} cy={HUB.y} r="11" fill="none" stroke="#e8b94f" strokeWidth="2"><animate attributeName="r" from="11" to="34" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.9" to="0" dur="2.4s" repeatCount="indefinite" /></circle>
            <text x={HUB.x} y={HUB.y + 34} textAnchor="middle" fontSize="13" fontWeight="600" fill="#0b1020" fontFamily="var(--font-jetbrains)">INDIA</text>
          </svg>
          <Chip className="left-[2%] top-[8%]" delay={0.3} icon={<Search className="size-4" />}>HS 0910.30 found</Chip>
          <Chip className="right-[0%] top-[44%]" delay={0.6} icon={<FileText className="size-4" />}>Invoice ready</Chip>
          <Chip className="bottom-[4%] left-[10%]" delay={0.9} icon={<Landmark className="size-4" />}>Incentive checked</Chip>
        </div>
      </div>
    </section>
  );
}
