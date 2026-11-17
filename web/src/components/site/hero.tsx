"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FileText, ScanSearch, Stamp } from "lucide-react";
import { Globe } from "./globe";

function FloatingCard({
  className,
  delay,
  icon,
  title,
  detail,
}: {
  className: string;
  delay: number;
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute flex items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(11,16,32,0.25)] backdrop-blur ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={
        reduce
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, -8, 0] }
      }
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { duration: 0.6, delay },
              y: { duration: 5, delay, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-ink text-brass-light">
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block font-mono text-xs text-muted-foreground">
          {detail}
        </span>
      </span>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-12 md:grid-cols-2 md:pt-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-brass" />
            Global Trade Simplified
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Trade Beyond Borders.{" "}
            <span className="text-primary">Without the Complexity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            One intelligent workspace for import-export documentation, product
            classification and global trade operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-paper transition-colors hover:bg-primary"
            >
              Create your first document free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="px-2 py-3 font-medium text-foreground underline-offset-4 hover:underline"
            >
              See how it works
            </a>
          </motion.div>

          <p className="mt-5 font-mono text-xs text-muted-foreground">
            ₹249 / month · first document free
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <Globe />
          <FloatingCard
            className="left-0 top-[10%] sm:-left-6"
            delay={0.6}
            icon={<FileText className="size-4" />}
            title="Proforma Invoice"
            detail="PI-0001 · Draft"
          />
          <FloatingCard
            className="right-0 top-[44%] sm:-right-4"
            delay={0.9}
            icon={<ScanSearch className="size-4" />}
            title="HS Code suggested"
            detail="8471.30 · verify"
          />
          <FloatingCard
            className="bottom-[8%] left-[6%]"
            delay={1.2}
            icon={<Stamp className="size-4" />}
            title="Packing List"
            detail="PL-0001 · Ready"
          />
        </div>
      </div>
    </section>
  );
}