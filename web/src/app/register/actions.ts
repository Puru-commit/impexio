"use server";

import { cookies } from "next/headers";
import { signIn } from "@/auth";
import { SIGNUP_COOKIE, readSignup } from "@/lib/signup";

export async function registerAction(_prev: { error: string }, fd: FormData): Promise<{ error: string }> {
  const r = readSignup(fd);
  if ("error" in r) return { error: r.error };
  (await cookies()).set(SIGNUP_COOKIE, JSON.stringify(r.value), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  // Sends the visitor to Google, then to /api/onboard, then into the app.
  await signIn("google", { redirectTo: "/api/onboard" });
  return { error: "" };
}
