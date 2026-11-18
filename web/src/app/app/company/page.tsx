import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { AlertTriangle } from "lucide-react";
import { auth } from "@/auth";
import { emptyCompany, getCompany, type CompanyValues } from "@/lib/company";
import { CompanyForm } from "./company-form";

export const metadata: Metadata = { title: "Company profile — IMPEXIO" };

async function Content() {
  await connection();
  const session = await auth();
  if (!session?.user) return null;

  let initial: CompanyValues = emptyCompany();
  let dbError = false;
  try {
    initial = await getCompany(Number(session.user.id));
  } catch {
    dbError = true;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Settings</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Company profile</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Save your company details once. IMPEXIO fills them into every document for you.
      </p>
      {dbError && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" />
          Could not reach the database. Start Laragon and refresh this page.
        </div>
      )}
      <div className="mt-8">
        <CompanyForm initial={initial} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}
