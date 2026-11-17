"use client";

import { motion, useReducedMotion } from "motion/react";

// Small seeded random generator, so the star positions are identical on the
// server and in the browser (random values would break the page on load).
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(11);
const STARS = Array.from({ length: 56 }, () => {
  const y = 28 + rand() * 66; // percent from the top, mostly in the lower part
  return {
    x: rand() * 100,
    y,
    size: 1.5 + rand() * 2.5,
    peak: Math.min(1, (y - 28) / 50), // brighter the deeper we go
    delay: rand() * 4,
    duration: 2.4 + rand() * 3,
  };
});

/**
 * A "descent into space" between a light section and a dark one:
 * daylight sky -> deep blue -> night, with stars fading in and a curved,
 * glowing planet horizon. Use `compact` for a shorter version.
 */
export function Atmosphere({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const stars = compact ? STARS.slice(0, 30) : STARS;

  return (
    <div
      aria-hidden
      className={`relative -mb-px overflow-hidden ${
        compact ? "h-40 md:h-56" : "h-56 md:h-80"
      }`}
      style={{
        background:
          "linear-gradient(in oklab to bottom, #f4f1ea 0%, #e1e8f4 8%, #a3bade 28%, #4167ad 52%, #17244f 77%, #0b1020 100%)",
      }}
    >
      {stars.map((s, i) => (
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

      {/* glowing planet horizon */}
      <div
        className={`absolute -bottom-px left-1/2 w-[170%] -translate-x-1/2 rounded-t-[100%] border-t-2 border-brass-light/80 bg-ink ${
          compact ? "h-16 md:h-24" : "h-24 md:h-32"
        }`}
        style={{
          boxShadow:
            "0 -2px 28px rgba(232,185,79,0.75), 0 -16px 100px rgba(232,185,79,0.4)",
        }}
      />
    </div>
  );
}
