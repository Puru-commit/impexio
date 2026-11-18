import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { AlertTriangle, ArrowRight, Building2, Gift, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { FREE_DOCUMENT_LIMIT, getPlan, type Plan } from "@/lib/plan";
import { companyCompleteness, getCompany } from "@/lib/company";
import { ALL_TOOLS } from "@/lib/tools";

export const metadata: Metadata = { title: "Dashboard — IMPEXIO" };

async function DashboardContent() {
  await connection();
  const session = await auth();
  if (!session?.user) return null;
  const userId = Number(session.user.id);

  let plan: Plan | null = null;
  let completeness = 0;
  let dbError = false;
  try {
    plan = await getPlan(userId);
    completeness = companyCompleteness(await getCompany(userId));
  } catch {
    dbError = true;
  }

  const first = session.user.name?.split(" ")[0] ?? "trader";
  const isPaid = plan?.status === "active";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
        Dashboard
      </p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Welcome, {first}</h1>

      {dbError && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" />
          Could not reach the database. Start Laragon and refresh this page.
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <section className="dark relative overflow-hidden rounded-3xl border border-brass/40 bg-ink p-7 text-foreground">
          <div aria-hidden className="absolute -right-12 -top-12 size-48 rounded-full bg-brass/25 blur-3xl" />
          <p className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
            <Gift className="size-4" />
            Your plan
          </p>
          <h2 className="relative mt-3 text-2xl font-semibold">
            {isPaid ? "Monthly plan" : "Free trial"}
          </h2>
          <p className="relative mt-2 text-sm text-muted-foreground">
            {plan
              ? isPaid
                ? "You can create documents without a limit on this plan."
                : `${plan.freeDocsUsed} of ${FREE_DOCUMENT_LIMIT} free document used.`
              : "Plan details are not available right now."}
          </p>
          {plan && !isPaid && (
            <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brass-light"
                style={{ width: `${Math.min(100, (plan.freeDocsUsed / FREE_DOCUMENT_LIMIT) * 100)}%` }}
              />
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-border bg-white/85 p-7 shadow-[0_24px_48px_-36px_rgba(11,16,32,0.45)]">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
            <Building2 className="size-4" />
            Company profile
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{completeness}% complete</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill it in once. We will reuse it on every document.
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-brass to-brass-light" style={{ width: `${completeness}%` }} />
          </div>
          <Link
            href="/app/company"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            {completeness === 100 ? "Review profile" : "Complete profile"}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>

      <h2 className="mt-12 flex items-center gap-2 text-xl font-semibold">
        <Sparkles className="size-5 text-[#9a6f1f]" />
        Start a document
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_TOOLS.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/app/tools/${t.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-white/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/60 hover:bg-white"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink text-brass-light transition-transform group-hover:-rotate-6">
                <t.icon className="size-[18px]" />
              </span>
              <span className="text-sm font-medium leading-snug">{t.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
