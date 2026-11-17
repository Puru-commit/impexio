"use client";

import { motion, useReducedMotion } from "motion/react";

// Seeded random so star positions match on the server and in the browser.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(23);
const DAWN_STARS = Array.from({ length: 44 }, () => {
  const y = 2 + rand() * 58;
  return {
    x: rand() * 100,
    y,
    size: 1.5 + rand() * 2.2,
    peak: Math.max(0.15, 1 - y / 60), // brighter near the top, fading as dawn arrives
    delay: rand() * 4,
    duration: 2.4 + rand() * 3,
  };
});

/**
 * Night -> sunrise -> daylight. Sits under a dark section and hands the page
 * back to a light one.
 */
export function Dawn() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative -mb-px h-60 overflow-hidden md:h-80"
      style={{
        background:
          "linear-gradient(in oklab to bottom, #0b1020 0%, #17244f 20%, #4167ad 44%, #a3bade 68%, #f1e6cf 88%, #f4f1ea 100%)",
      }}
    >
      {DAWN_STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-paper"
          style={{
            left: `${s.x.toFixed(2)}%`,
            top: `${s.y.toFixed(2)}%`,
            width: s.size,
            height: s.size,
            opacity: s.peak * 0.9,
          }}
          animate={
            reduce
              ? undefined
              : { opacity: [s.peak * 0.25, s.peak, s.peak * 0.25] }
          }
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* the sun, just below the edge of the world */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 62% at 50% 100%, rgba(232,185,79,0.6), rgba(232,185,79,0.2) 45%, transparent 72%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 96%)",
        }}
      >
        <div className="absolute -bottom-64 left-1/2 aspect-square w-[72%] -translate-x-1/2 rounded-full border border-brass-light/50 md:-bottom-96" />
        <div className="absolute -bottom-80 left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full border border-brass-light/25 md:-bottom-[30rem]" />
      </div>
    </div>
  );
}

const NODES = [
  { x: 120, y: 90, label: "MUMBAI" },
  { x: 480, y: 60, label: "DUBAI" },
  { x: 840, y: 60, label: "ROTTERDAM" },
  { x: 1200, y: 40, label: "NEW YORK" },
];

/** A dashed trade route with moving dashes and pulsing ports. */
export function RouteDivider() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative h-32 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #f4f1ea, #ece6d6)" }}
    >
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <motion.path
          d="M120,90 Q300,10 480,60 T840,60 T1200,40"
          fill="none"
          stroke="#c8963e"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
          animate={reduce ? undefined : { strokeDashoffset: [0, -56] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        {NODES.map((n) => (
          <g key={n.label}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={6}
              fill="none"
              stroke="#c8963e"
              animate={reduce ? undefined : { r: [6, 18], opacity: [0.7, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx={n.x} cy={n.y} r={5} fill="#0b1020" />
            <circle cx={n.x} cy={n.y} r={2} fill="#e8b94f" />
            <text
              x={n.x}
              y={n.y + 28}
              textAnchor="middle"
              fontSize="11"
              letterSpacing="2.5"
              fill="#5b6275"
              fontFamily="var(--font-jetbrains), monospace"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const WAVE =
  "M0,40 C120,0 240,0 360,40 S600,80 720,40 S960,0 1080,40 S1320,80 1440,40 S1680,0 1800,40 S2040,80 2160,40 S2400,0 2520,40 S2760,80 2880,40 V100 H0 Z";

/** Two slow waves that hand one section's colour over to the next. */
export function WaveEdge({ from, to }: { from: string; to: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative -mb-px h-16 overflow-hidden md:h-24"
      style={{ background: from }}
    >
      <motion.svg
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-full w-[200%]"
        style={{ fill: to, opacity: 0.45 }}
        animate={reduce ? undefined : { x: ["-50%", "0%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        <path d={WAVE} />
      </motion.svg>
      <motion.svg
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[78%] w-[200%]"
        style={{ fill: to }}
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <path d={WAVE} />
      </motion.svg>
    </div>
  );
}
