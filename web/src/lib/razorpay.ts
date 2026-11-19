import { createHmac, timingSafeEqual } from "node:crypto";

export const PRICE_PAISE = 24900; // Rs 249
export const PLAN_DAYS = 30;

function keys() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new Error("NOT_CONFIGURED");
  return { id, secret };
}
export const razorpayConfigured = () => !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

/** Creates a Razorpay order. The amount is fixed here on the server, never taken from the browser. */
export async function createOrder(receipt: string) {
  const { id, secret } = keys();
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}` },
    body: JSON.stringify({ amount: PRICE_PAISE, currency: "INR", receipt: receipt.slice(0, 40) }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("ORDER_FAILED");
  const o = (await res.json()) as { id: string };
  return { orderId: o.id, keyId: id };
}

/** Checks that the payment really came from Razorpay (HMAC SHA256 of "order|payment"). */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const { secret } = keys();
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
