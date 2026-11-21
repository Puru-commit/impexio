import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "EXIM Master", href: "/exim-master" },
      { label: "Export", href: "/export" },
      { label: "Import", href: "/import" },
      { label: "Export Incentives", href: "/export-incentives" },
      { label: "Buyers", href: "/buyers" },
      { label: "Sellers", href: "/sellers" },
      { label: "HS Code Finder", href: "/hs-code-finder" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms and Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="dark border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="inline-block rounded-2xl bg-paper p-3">
              <Image
                src="/impexio-logo.png"
                alt="IMPEXIO — Global Trade Simplified"
                width={1075}
                height={793}
                className="h-24 w-auto"
              />
            </div>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              One intelligent workspace for import-export documentation,
              product classification and global trade operations.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 IMPEXIO. All rights reserved.</p>
          <p className="max-w-xl md:text-right">
            Documents and HS Code suggestions are provided to assist your
            preparation and are not government or customs approved.
          </p>
        </div>
      </div>
    </footer>
  );
}
