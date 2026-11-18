import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Hammer, Plus } from "lucide-react";
import { auth } from "@/auth";
import { FREE_DOCUMENT_LIMIT, getPlan, type Plan } from "@/lib/plan";
import { ALL_TOOLS, findTool } from "@/lib/tools";
import { hasGenerator } from "@/lib/generators";
import { listDocuments } from "@/lib/documents";

export function generateStaticParams() {
  return ALL_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findTool(slug);
  return { title: found ? `${found.tool.title} — IMPEXIO` : "IMPEXIO" };
}

async function Content({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = findTool(slug);
  if (!found) notFound();
  const { tool, group } = found;

  await connection();
  const session = await auth();
  let plan: Plan | null = null;
  let docs: Awaited<ReturnType<typeof listDocuments>> = [];
  const live = hasGenerator(slug);
  try {
    if (session?.user) {
      const userId = Number(session.user.id);
      plan = await getPlan(userId);
      if (live) docs = await listDocuments(userId, slug);
    }
  } catch {
    plan = null;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <Link href="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <span className="mt-8 flex size-14 items-center justify-center rounded-2xl bg-ink text-brass-light">
        <tool.icon className="size-6" />
      </span>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">{group.title}</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{tool.title}</h1>
      <p className="mt-3 text-muted-foreground">{tool.text}</p>

      {plan && (
        <p className="mt-6 inline-block rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm">
          {plan.status === "active"
            ? "Monthly plan: no document limit."
            : plan.canGenerate
              ? `Free trial: ${FREE_DOCUMENT_LIMIT - plan.freeDocsUsed} free document left.`
              : "Your free document is used. Upgrade to continue."}
        </p>
      )}

      {live ? (
        <>
          <Link
            href={`/app/tools/${slug}/new`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98]"
          >
            <Plus className="size-4" />
            New {tool.title}
          </Link>

          <h2 className="mt-10 text-lg font-semibold">Your documents</h2>
          {docs.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nothing here yet. Create your first one above.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {docs.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/app/documents/${d.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white/80 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-brass/60 hover:bg-white"
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="size-5 text-[#9a6f1f]" />
                      <span className="font-medium">{d.title}</span>
                    </span>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground">
                      {new Date(d.updatedAt).toISOString().slice(0, 10)}
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono uppercase tracking-wider ${d.status === "final" ? "border-[#2f7a4a]/40 text-[#2f7a4a]" : "border-border"}`}>
                        {d.status}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-brass/60 bg-white/70 p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Hammer className="size-5 text-[#9a6f1f]" />
            The generator is being built
          </h2>
          <p className="mt-2 text-muted-foreground">
            This tool will let you fill in the details, preview the result and
            download a PDF. The Export Proforma Invoice is ready now, and the rest follow the same way.
          </p>
        </div>
      )}
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
