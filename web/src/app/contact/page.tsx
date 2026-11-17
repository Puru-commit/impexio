import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/site/legal-page";
import { Reveal } from "@/components/site/reveal";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = { title: "Contact — IMPEXIO" };

export default function Page() {
  const items = [
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Address", value: `${SITE.legalName}, ${SITE.address}` },
  ];

  return (
    <PageShell
      eyebrow="Contact"
      title={
        <>
          We are here to{" "}
          <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
            help.
          </span>
        </>
      }
      intro="Questions about IMPEXIO, your account or a payment? Write to us and we will reply."
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.label}>
            <Reveal delay={i * 0.08} className="h-full">
              <div className="h-full rounded-3xl border border-border bg-white/80 p-6 shadow-[0_20px_40px_-34px_rgba(11,16,32,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-brass/50">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light">
                  <it.icon className="size-5" />
                </span>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
                  {it.label}
                </p>
                {it.href ? (
                  <a
                    href={it.href}
                    className="mt-1.5 block break-words font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {it.value}
                  </a>
                ) : (
                  <p className="mt-1.5 break-words font-medium">{it.value}</p>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted-foreground">
        For billing questions, include your registered email and the payment
        details so we can find it quickly.
      </p>
    </PageShell>
  );
}
