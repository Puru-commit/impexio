import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { signIn } from "@/auth";

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";

  async function google() {
    "use server";
    await signIn("google", { redirectTo: "/app" });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 size-[480px] rounded-full bg-brass/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 size-[440px] rounded-full bg-signal/15 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mx-auto block w-fit">
          <Image
            src="/impexio-logo.png"
            alt="IMPEXIO — Global Trade Simplified"
            width={1075}
            height={793}
            priority
            className="h-24 w-auto"
          />
        </Link>

        <div className="mt-6 rounded-3xl border border-border bg-white/85 p-8 shadow-[0_40px_80px_-40px_rgba(11,16,32,0.5)] backdrop-blur-sm">
          <h1 className="text-center text-2xl font-semibold md:text-3xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isLogin
              ? "Log in to your IMPEXIO workspace."
              : "Your first document is free. No card needed."}
          </p>

          <form action={google} className="mt-8">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-white px-6 py-3.5 font-medium transition-all hover:border-brass/60 hover:shadow-md active:scale-[0.98]"
            >
              <GoogleG />
              Continue with Google
            </button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-[#9a6f1f]" />
            We never see your Google password.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "New to IMPEXIO? " : "Already have an account? "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline-offset-4 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
