import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Create account — IMPEXIO" };

// Whether the visitor is signed in is only known at request time.
async function RegisterGate() {
  await connection();
  if (await auth()) redirect("/app");
  return <AuthCard mode="register" />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-paper" />}>
      <RegisterGate />
    </Suspense>
  );
}
