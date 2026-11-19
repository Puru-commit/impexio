import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Plus } from "lucide-react";
import { DocList, type ListRow } from "@/components/app/doc-list";
import { fmt, fmtDate } from "@/lib/doc/core";
import { TOOL_DEFS } from "@/lib/doc/defs";
import { listDocuments, type DocRow } from "@/lib/documents";
import { FREE_DOCUMENT_LIMIT, getPlan, type Plan } from "@/lib/plan";
import { currentUserId } from "@/lib/session";
import { ALL_TOOLS, findTool } from "@/lib/tools";

export function generateStaticParams() {
  return ALL_TOOLS.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = findTool(slug);
  return { title: found ? `${found.tool.title} — IMPEXIO` : "IMPEXIO" };
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findTool(slug);
  const def = TOOL_DEFS[slug];
  if (!found || !def) notFound();
  const { tool, group } = found;

  await connection();
  const userId = await currentUserId();
  if (!userId) return null;

  let plan: Plan | null = null;
  let docs: DocRow[] = [];
  let dbError = false;
  try {
    plan = await getPlan(userId);
    docs = await listDocuments(userId, slug);
  } catch {
    dbError = true;
  }

  const rows: ListRow[] = docs.map((d) => ({
    id: d.id, ref: d.refNo, status: d.status,
    date: fmtDate(d.data.f.date) || new Date(d.updatedAt).toISOString().slice(0, 10),
    cells: def.listing.map((c) => c.get(d.data)),
  }));
  const count = (s: DocRow["status"]) => docs.filter((d) => d.status === s).length;
  const totals = new Map<string, number>();
  if (def.amountOf) for (const d of docs) {
    if (d.status === "cancelled") continue;
    const a = def.amountOf(d.data);
    if (a) totals.set(a.cur || "—", (totals.get(a.cur || "—") ?? 0) + a.value);
  }
  const stats: [string, string][] = [
    ["Total", String(docs.length)], ["Active", String(count("final"))], ["Draft", String(count("draft"))], ["Cancelled", String(count("cancelled"))],
    ...[...totals].map(([c, v]): [string, string] => [`Total (${c})`, fmt(v)]),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <Link href="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-brass-light"><tool.icon className="size-6" /></span>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">{group.title}</p>
            <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{tool.title}</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">{tool.text}</p>
          </div>
        </div>
        <Link href={`/app/tools/${slug}/new`} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98]"><Plus className="size-4" /> New {tool.title}</Link>
      </div>

      {plan && (
        <p className="mt-6 inline-block rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm">
          {plan.paid ? "Monthly plan: no document limit." : plan.canGenerate ? `Free trial: ${FREE_DOCUMENT_LIMIT - plan.freeDocsUsed} free document left.` : <>Your free document is used. <Link href="/app/billing" className="font-medium underline underline-offset-4">Upgrade</Link> to continue.</>}
          {!def.counts && " This tool is free to use."}
        </p>
      )}

      {dbError ? (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" /> Could not reach the database. Start Laragon and refresh.</div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {stats.map(([l, v]) => (
              <div key={l} className="rounded-2xl border border-border bg-white/80 px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                <div className="mt-1 text-xl font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            {docs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-brass/60 bg-white/70 p-10 text-center text-muted-foreground">Nothing here yet. Press “New {tool.title}” to create your first one.</div>
            ) : (
              <DocList headers={def.listing.map((c) => c.label)} rightCols={def.listing.map((c) => !!c.right)} rows={rows} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={null}><Content params={params} /></Suspense>;
}
