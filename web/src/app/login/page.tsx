import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Log in — IMPEXIO" };

// Whether the visitor is signed in is only known at request time.
async function LoginGate() {
  await connection();
  if (await auth()) redirect("/app");
  return <AuthCard mode="login" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-paper" />}>
      <LoginGate />
    </Suspense>
  );
}
