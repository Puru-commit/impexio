"use server";

import { activatePlan, recordOrder } from "@/lib/billing";
import { createOrder, razorpayConfigured, verifySignature } from "@/lib/razorpay";
import { currentUserId } from "@/lib/session";
import { auth } from "@/auth";

export type StartResult = { ok: true; orderId: string; keyId: string; name: string; email: string } | { ok: false; message: string };
export type PayResult = { ok: boolean; message: string };

export async function startPaymentAction(): Promise<StartResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, message: "Please log in again." };
  if (!razorpayConfigured()) return { ok: false, message: "Payments are not set up yet. Add your Razorpay test keys to .env.local and restart." };
  try {
    const session = await auth();
    const { orderId, keyId } = await createOrder(`impexio-${userId}-${Date.now()}`);
    await recordOrder(userId, orderId);
    return { ok: true, orderId, keyId, name: session?.user?.name ?? "", email: session?.user?.email ?? "" };
  } catch {
    return { ok: false, message: "Could not start the payment. Check your Razorpay keys and the database." };
  }
}

export async function confirmPaymentAction(orderId: string, paymentId: string, signature: string): Promise<PayResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, message: "Please log in again." };
  if (![orderId, paymentId, signature].every((v) => typeof v === "string" && v.length > 5 && v.length < 200)) return { ok: false, message: "Invalid payment details." };
  try {
    if (!verifySignature(orderId, paymentId, signature)) return { ok: false, message: "Payment could not be verified. You have not been charged a plan." };
    const r = await activatePlan(userId, orderId, paymentId);
    if (r === "missing") return { ok: false, message: "This payment does not belong to your account." };
    return { ok: true, message: r === "ok" ? "Payment received. Your monthly plan is active." : "This payment was already counted." };
  } catch {
    return { ok: false, message: "Payment was made but we could not save it. Please contact support with your payment id." };
  }
}
