import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/site/reveal";

export type LegalSection = { h: string; p: string[]; list?: string[] };

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-24 size-[420px] rounded-full bg-brass/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-24 size-[380px] rounded-full bg-signal/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-5 pb-8 pt-16 md:pt-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
              <span className="size-1.5 rounded-full bg-brass" />
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              {title}
            </h1>
            {intro && (
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                {intro}
              </p>
            )}
          </div>
        </section>
        <div className="mx-auto max-w-4xl px-5 pb-24 pt-6">{children}</div>
      </main>
      <Footer />
    </>
  );
}

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <PageShell
      eyebrow={eyebrow}
      title={title}
      intro={`Last updated: ${updated}`}
    >
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <nav
          aria-label="On this page"
          className="hidden self-start md:sticky md:top-32 md:block"
        >
          <ul className="space-y-2 border-l border-border pl-4 text-sm">
            {sections.map((s, i) => (
              <li key={s.h}>
                <a
                  href={`#s${i + 1}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.h}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-5">
          {sections.map((s, i) => (
            <Reveal key={s.h}>
              <section
                id={`s${i + 1}`}
                className="scroll-mt-32 rounded-3xl border border-border bg-white/80 p-7 shadow-[0_20px_40px_-34px_rgba(11,16,32,0.4)]"
              >
                <h2 className="text-xl font-semibold">
                  <span className="mr-2 font-mono text-sm text-[#9a6f1f]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.h}
                </h2>
                {s.p.map((t) => (
                  <p key={t} className="mt-3 leading-relaxed text-muted-foreground">
                    {t}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground marker:text-brass">
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
          <p className="pt-2 text-sm text-muted-foreground">
            Questions about this page?{" "}
            <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
