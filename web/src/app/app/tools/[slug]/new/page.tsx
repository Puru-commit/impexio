import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { DocEditor } from "@/components/app/doc-editor";
import { newData, todayIso } from "@/lib/doc/core";
import { TOOL_DEFS } from "@/lib/doc/defs";
import { emptyCompany, getCompany, type CompanyValues } from "@/lib/company";
import { nextRef } from "@/lib/documents";
import { getPlan } from "@/lib/plan";
import { currentUserId } from "@/lib/session";
import { ALL_TOOLS } from "@/lib/tools";

export const metadata: Metadata = { title: "New document — IMPEXIO" };
export function generateStaticParams() {
  return ALL_TOOLS.map((t) => ({ slug: t.slug }));
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = TOOL_DEFS[slug];
  if (!def) notFound();

  await connection();
  const userId = await currentUserId();
  if (!userId) return null;

  let master: CompanyValues = emptyCompany();
  let ref = `${def.prefix}-${todayIso().slice(0, 4)}-0001`;
  let limitReached = false;
  try {
    master = await getCompany(userId);
    ref = await nextRef(userId, slug);
    limitReached = def.counts && !(await getPlan(userId)).canGenerate;
  } catch {
    // The editor still opens; saving will show a clear message.
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 md:pt-8">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">New {def.title}</h1>
      <DocEditor slug={slug} docId={null} status={null} limitReached={limitReached} backHref={`/app/tools/${slug}`} initial={newData(def, master, { today: todayIso(), ref })} />
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={null}><Content params={params} /></Suspense>;
}
