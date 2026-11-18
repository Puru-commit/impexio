import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CheckCircle2 } from "lucide-react";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = { title: "Dashboard — IMPEXIO" };

async function DashboardContent() {
  await connection();
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user;

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <header className="flex items-center justify-between gap-4">
        <Link href="/">
          <Image
            src="/impexio-logo.png"
            alt="IMPEXIO"
            width={1075}
            height={793}
            className="h-16 w-auto"
          />
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-ink/20 bg-white/60 px-5 py-2.5 text-sm font-medium transition-all hover:border-brass/60 hover:bg-white"
          >
            Log out
          </button>
        </form>
      </header>

      <section className="mt-10 rounded-3xl border border-border bg-white/85 p-8 shadow-[0_30px_60px_-40px_rgba(11,16,32,0.5)]">
        <div className="flex items-center gap-4">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
              className="size-14 rounded-full border border-border"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome, {user.name?.split(" ")[0] ?? "trader"}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <ul className="mt-8 space-y-3 text-sm">
          {[
            "Google login works.",
            "Your account is saved in the database.",
            "You are on the free plan: one free document.",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <CheckCircle2 className="size-5 text-[#9a6f1f]" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted-foreground">
          The tools and your company profile arrive in the next step.
        </p>
      </section>
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
