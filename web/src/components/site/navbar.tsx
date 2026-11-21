"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, ShoppingBag, Store, X } from "lucide-react";

const LINKS = [
  { label: "EXIM Master", href: "/exim-master" },
  { label: "Export", href: "/export" },
  { label: "Import", href: "/import" },
  { label: "Export Incentives", href: "/export-incentives" },
];
const TRADE = [
  { label: "Buyers", text: "Find buyers for your products", href: "/buyers", icon: ShoppingBag },
  { label: "Sellers", text: "Find suppliers and sellers", href: "/sellers", icon: Store },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const path = usePathname();
  const on = (h: string) => path === h || path.startsWith(h + "/");
  const link = (active: boolean) =>
    `block rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${active ? "bg-ink text-paper" : "text-foreground/75 hover:bg-secondary hover:text-foreground"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 xl:grid xl:h-[88px] xl:grid-cols-[auto_1fr_auto]" aria-label="Main">
        <Link href="/" className="flex items-center" aria-label="IMPEXIO home">
          <Image src="/impexio-logo.png" alt="IMPEXIO — Global Trade Simplified" width={1075} height={793} priority className="h-16 w-auto xl:h-[72px]" />
        </Link>

        <ul className="hidden items-center justify-self-center rounded-full border border-border/80 bg-card/70 p-1.5 xl:flex">
          {LINKS.map((l) => (
            <li key={l.href}><Link href={l.href} className={link(on(l.href))}>{l.label}</Link></li>
          ))}
          <li className="relative" onMouseEnter={() => setDd(true)} onMouseLeave={() => setDd(false)}>
            <button type="button" aria-haspopup="menu" aria-expanded={dd} onClick={() => setDd((v) => !v)} onKeyDown={(e) => e.key === "Escape" && setDd(false)}
              className={`flex items-center gap-1 ${link(on("/buyers") || on("/sellers"))}`}>
              Buyers / Sellers <ChevronDown className={`size-4 transition-transform ${dd ? "rotate-180" : ""}`} />
            </button>
            {dd && (
              <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                <div role="menu" className="rounded-2xl border border-border bg-white p-2 shadow-[0_30px_60px_-30px_rgba(11,16,32,0.45)]">
                  {TRADE.map((t) => (
                    <Link key={t.href} href={t.href} role="menuitem" onClick={() => setDd(false)} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-ink text-brass-light"><t.icon className="size-5" /></span>
                      <span><span className="block text-sm font-semibold">{t.label}</span><span className="block text-xs text-muted-foreground">{t.text}</span></span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
          <li><Link href="/pricing" className={link(on("/pricing"))}>Pricing</Link></li>
        </ul>

        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/login" className="rounded-full border border-ink/20 bg-white/60 px-5 py-2.5 text-sm font-medium transition-all hover:border-brass/60 hover:bg-white">Log in</Link>
          <Link href="/register" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-primary">Start free</Link>
        </div>

        <button type="button" className="-mr-2 rounded-md p-2 xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-border bg-background px-5 pb-6 pt-2 xl:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-3.5 text-base">{l.label}</Link></li>
            ))}
            <li className="border-b border-border/60 py-3.5">
              <p className="text-base">Buyers / Sellers</p>
              <div className="mt-2 flex gap-2">
                {TRADE.map((t) => (<Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-center text-sm font-medium">{t.label}</Link>))}
              </div>
            </li>
            <li><Link href="/pricing" onClick={() => setOpen(false)} className="block border-b border-border/60 py-3.5 text-base">Pricing</Link></li>
          </ul>
          <div className="mt-5 flex gap-3">
            <Link href="/login" className="flex-1 rounded-full border border-border py-3 text-center text-sm font-medium">Log in</Link>
            <Link href="/register" className="flex-1 rounded-full bg-ink py-3 text-center text-sm font-medium text-paper">Start free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
