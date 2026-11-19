"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanSearch,
  Users,
  X,
} from "lucide-react";
import { TOOL_GROUPS } from "@/lib/tools";

type User = { name?: string | null; email?: string | null; image?: string | null };

const SOON = [
  { label: "HS Code Finder", icon: ScanSearch },
  { label: "Buyers & Suppliers", icon: Users },
  { label: "Reports", icon: BarChart3 },
];

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const link = (href: string, label: string, Icon?: React.ElementType) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-brass-light/15 font-medium text-brass-light"
            : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <nav aria-label="App" className="space-y-6 text-sm">
      <div className="space-y-1">
        {link("/app", "Dashboard", LayoutDashboard)}
        {link("/app/company", "Company profile", Building2)}
        {link("/app/billing", "Plan & billing", CreditCard)}
      </div>

      {TOOL_GROUPS.map((g) => (
        <div key={g.id}>
          <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {g.title}
          </p>
          <div className="space-y-0.5">
            {g.tools.map((t) => link(`/app/tools/${t.slug}`, t.title, t.icon))}
          </div>
        </div>
      ))}

      <div>
        <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Coming soon
        </p>
        <div className="space-y-0.5">
          {SOON.map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-foreground/40"
            >
              <s.icon className="size-4 shrink-0" />
              <span className="truncate">{s.label}</span>
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

function UserBox({ user, logout }: { user: User; logout: () => Promise<void> }) {
  return (
    <div className="border-t border-white/10 p-4">
      <div className="flex items-center gap-3">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            referrerPolicy="no-referrer"
            className="size-9 rounded-full"
          />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-white/10 text-sm">
            {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name ?? "Your account"}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <form action={logout} className="mt-3">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition-colors hover:border-brass/60"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </form>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/app" className="block w-fit rounded-xl bg-paper p-2">
      <Image
        src="/impexio-logo.png"
        alt="IMPEXIO"
        width={1075}
        height={793}
        className="h-14 w-auto"
      />
    </Link>
  );
}

export function AppShell({
  user,
  logout,
  children,
}: {
  user: User;
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[268px_1fr]">
      {/* Desktop sidebar */}
      <aside className="dark hidden h-screen flex-col bg-ink text-foreground lg:sticky lg:top-0 lg:flex">
        <div className="p-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <Nav />
        </div>
        <UserBox user={user} logout={logout} />
      </aside>

      {/* Mobile top bar */}
      <header className="dark sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 text-foreground lg:hidden">
        <Logo />
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-10 items-center justify-center rounded-full border border-white/15"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {open && (
        <div className="dark fixed inset-0 z-40 flex flex-col bg-ink text-foreground lg:hidden">
          <div className="flex items-center justify-between p-4">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex size-10 items-center justify-center rounded-full border border-white/15"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <Nav onNavigate={() => setOpen(false)} />
          </div>
          <UserBox user={user} logout={logout} />
        </div>
      )}

      <div className="min-w-0 bg-paper">{children}</div>
    </div>
  );
}
