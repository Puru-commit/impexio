import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { DocEditor } from "@/components/app/doc-editor";
import { emptyCompany, getCompany } from "@/lib/company";
import { padData } from "@/lib/doc/core";
import { TOOL_DEFS } from "@/lib/doc/defs";
import { getDocument, type DocRow } from "@/lib/documents";
import { getPlan } from "@/lib/plan";
import { currentUserId } from "@/lib/session";

export const metadata: Metadata = { title: "Document — IMPEXIO" };

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docId = Number(id);
  if (!Number.isInteger(docId) || docId < 1) notFound();

  await connection();
  const userId = await currentUserId();
  if (!userId) return null;

  let doc: DocRow | null = null;
  let limitReached = false;
  let master = emptyCompany();
  try {
    doc = await getDocument(userId, docId);
    if (doc) {
      master = await getCompany(userId);
      limitReached = TOOL_DEFS[doc.docType].counts && !(await getPlan(userId)).canGenerate;
    }
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" /> Could not reach the database. Start Laragon and refresh this page.</div>
      </div>
    );
  }
  if (!doc) notFound();
  const def = TOOL_DEFS[doc.docType];

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 md:pt-8">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">{doc.title}</h1>
      <DocEditor
        key={`${doc.id}-${doc.status}-${doc.updatedAt.valueOf()}`}
        slug={doc.docType} docId={doc.id} status={doc.status} limitReached={limitReached && doc.status === "draft"}
        backHref={`/app/tools/${doc.docType}`} initial={padData(def, doc.data, master)}
      />
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={null}><Content params={params} /></Suspense>;
}
