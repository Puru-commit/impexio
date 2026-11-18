import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { ProformaEditor } from "@/components/app/proforma-editor";
import { getDocument, type DocRow } from "@/lib/documents";
import { getPlan } from "@/lib/plan";
import { sanitizeProforma } from "@/lib/proforma";
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
  try {
    doc = await getDocument(userId, docId);
    limitReached = !(await getPlan(userId)).canGenerate;
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" />
          Could not reach the database. Start Laragon and refresh this page.
        </div>
      </div>
    );
  }
  if (!doc || doc.docType !== "export-proforma-invoice") notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <Link href={`/app/tools/${doc.docType}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Export Proforma Invoice
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold md:text-4xl">{doc.title}</h1>
        <span className={`rounded-full border px-3 py-0.5 font-mono text-xs uppercase tracking-wider ${doc.status === "final" ? "border-[#2f7a4a]/40 text-[#2f7a4a]" : "border-border text-muted-foreground"}`}>
          {doc.status}
        </span>
      </div>
      <div className="mt-8">
        <ProformaEditor docId={doc.id} initial={sanitizeProforma(doc.data)} status={doc.status} limitReached={limitReached && doc.status !== "final"} />
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}
