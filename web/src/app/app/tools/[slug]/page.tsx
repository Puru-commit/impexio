import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProformaEditor } from "@/components/app/proforma-editor";
import { emptyCompany, getCompany, type CompanyValues } from "@/lib/company";
import { hasGenerator } from "@/lib/generators";
import { getPlan } from "@/lib/plan";
import { newProforma } from "@/lib/proforma";
import { currentUserId } from "@/lib/session";
import { findTool } from "@/lib/tools";

export const metadata: Metadata = { title: "New document — IMPEXIO" };

export function generateStaticParams() {
  return [{ slug: "export-proforma-invoice" }];
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findTool(slug);
  if (!found || !hasGenerator(slug)) notFound();

  await connection();
  const userId = await currentUserId();
  if (!userId) return null;

  let company: CompanyValues = emptyCompany();
  let limitReached = false;
  try {
    company = await getCompany(userId);
    limitReached = !(await getPlan(userId)).canGenerate;
  } catch {
    // The editor still opens; saving will show a clear message.
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <Link href={`/app/tools/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        {found.tool.title}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">New {found.tool.title}</h1>
      <div className="mt-8">
        <ProformaEditor docId={null} initial={newProforma(company)} status={null} limitReached={limitReached} />
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}
