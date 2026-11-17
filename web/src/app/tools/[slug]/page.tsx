import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ALL_TOOLS, findTool } from "@/lib/tools";

export function generateStaticParams() {
  return ALL_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = findTool(slug);
  return { title: found ? `${found.tool.title} — IMPEXIO` : "IMPEXIO" };
}

// Placeholder for the generation page. The real form and PDF output are
// built in the documents phase, behind login.
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findTool(slug);
  if (!found) notFound();
  const { tool, group } = found;

  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-14 md:pt-20">
          <Link
            href={`/features#${group.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to features
          </Link>

          <span className="mt-8 flex size-14 items-center justify-center rounded-2xl bg-ink text-brass-light">
            <tool.icon className="size-6" />
          </span>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
            {group.title}
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-5xl">
            {tool.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{tool.text}</p>

          <div className="mt-10 rounded-3xl border border-dashed border-brass/60 bg-white/70 p-8">
            <h2 className="text-lg font-semibold">The generator is coming soon</h2>
            <p className="mt-2 text-muted-foreground">
              Here you will fill in your details and generate this document.
              Sign up now and your first document is free.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98]"
            >
              Start free
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
