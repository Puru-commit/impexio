import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Hammer } from "lucide-react";
import { auth } from "@/auth";
import { FREE_DOCUMENT_LIMIT, getPlan, type Plan } from "@/lib/plan";
import { ALL_TOOLS, findTool } from "@/lib/tools";

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
  try {
    if (session?.user) plan = await getPlan(Number(session.user.id));
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

      <div className="mt-8 rounded-3xl border border-dashed border-brass/60 bg-white/70 p-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Hammer className="size-5 text-[#9a6f1f]" />
          The generator is being built
        </h2>
        <p className="mt-2 text-muted-foreground">
          This tool will let you fill in the details, preview the result and
          download a PDF. We are building the first one next, and the rest follow the same way.
        </p>
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
