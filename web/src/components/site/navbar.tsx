"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features", href: "/features" },
  { label: "Import", href: "/#import" },
  { label: "Export", href: "/#export" },
  { label: "HS Code Finder", href: "/#hs-code" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <nav
        className="mx-auto flex h-24 max-w-6xl items-center justify-between px-5 lg:grid lg:h-[104px] lg:grid-cols-[1fr_auto_1fr]"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center justify-self-start" aria-label="IMPEXIO home">
          <Image
            src="/impexio-logo.png"
            alt="IMPEXIO — Global Trade Simplified"
            width={1075}
            height={793}
            priority
            className="h-20 w-auto lg:h-[88px]"
          />
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-border/80 bg-card/70 p-1.5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="block rounded-full px-4 py-2 text-[15px] font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 justify-self-end lg:flex">
          <Link
            href="/login"
            className="rounded-full border border-ink/20 bg-white/60 px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brass/60 hover:bg-white active:scale-[0.98]"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-primary"
          >
            Start free
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-3.5 text-base"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <Link
              href="/login"
              className="flex-1 rounded-full border border-border py-3 text-center text-sm font-medium"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-full bg-ink py-3 text-center text-sm font-medium text-paper"
            >
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
