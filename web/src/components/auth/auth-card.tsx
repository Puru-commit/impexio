import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { signIn } from "@/auth";
import { AuthShell } from "./auth-shell";
import { GoogleG } from "./google-g";
import { RegisterForm } from "./register-form";

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  if (mode === "register") {
    return (
      <AuthShell
        title="Start trading smarter, today."
        text="Tell us a little about your business so we can set up your workspace."
        points={["AI HS Code Finder, free", "1 free document generation", "Export incentives guide, free", "Your details stay private"]}
      >
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Log in</Link>
        </p>
      </AuthShell>
    );
  }

  async function google() {
    "use server";
    await signIn("google", { redirectTo: "/app" });
  }

  return (
    <AuthShell
      title="Welcome back to your trade desk."
      text="Pick up where you left off: your documents, quotations and calculations are waiting."
      points={["Every document in one place", "Your company profile pre-fills each form", "Print-ready PDFs in a click"]}
    >
      <div className="mt-6 rounded-3xl border border-border bg-white/90 p-8 shadow-[0_40px_80px_-40px_rgba(11,16,32,0.5)] backdrop-blur-sm">
        <h1 className="text-center text-2xl font-semibold md:text-3xl">Log in</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Use the Google account you signed up with.</p>
        <form action={google} className="mt-8">
          <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-white px-6 py-3.5 font-medium transition-all hover:border-brass/60 hover:shadow-md active:scale-[0.98]"><GoogleG />Continue with Google</button>
        </form>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-[#9a6f1f]" />We never see your Google password.</p>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to IMPEXIO? <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
