"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Import", href: "#import" },
  { label: "Export", href: "#export" },
  { label: "HS Code AI", href: "#hs-code" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav
        className="mx-auto flex h-24 md:h-[104px] max-w-6xl items-center justify-between px-5"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center" aria-label="IMPEXIO home">
        <Image
            src="/impexio-logo.png"
            alt="IMPEXIO — Global Trade Simplified"
            width={1075}
            height={793}
            priority
            className="h-20 w-auto md:h-[88px]"
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary"
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
          className="-mr-2 rounded-md p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
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