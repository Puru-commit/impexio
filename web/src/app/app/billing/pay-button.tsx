"use client";

import Script from "next/script";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, CreditCard } from "lucide-react";
import { confirmPaymentAction, startPaymentAction } from "./actions";

type RzpResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RzpCtor = new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: () => void) => void };

export function PayButton({ label }: { label: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const pay = () =>
    start(async () => {
      setMsg(null);
      const s = await startPaymentAction();
      if (!s.ok) return setMsg({ ok: false, text: s.message });
      const Rzp = (window as unknown as { Razorpay?: RzpCtor }).Razorpay;
      if (!Rzp) return setMsg({ ok: false, text: "Payment window could not load. Check your internet and try again." });
      const box = new Rzp({
        key: s.keyId, order_id: s.orderId, amount: 24900, currency: "INR", name: "IMPEXIO", description: "Monthly plan — 30 days",
        prefill: { name: s.name, email: s.email }, theme: { color: "#0b1020" },
        handler: async (r: RzpResponse) => {
          const c = await confirmPaymentAction(r.razorpay_order_id, r.razorpay_payment_id, r.razorpay_signature);
          setMsg({ ok: c.ok, text: c.message });
          if (c.ok) router.refresh();
        },
      });
      box.on("payment.failed", () => setMsg({ ok: false, text: "Payment failed. You can try again." }));
      box.open();
    });

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button type="button" onClick={pay} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-brass-light px-7 py-3 text-sm font-medium text-ink transition-all hover:bg-white active:scale-[0.98] disabled:opacity-60">
        <CreditCard className="size-4" /> {pending ? "Opening…" : label}
      </button>
      {msg && (
        <p role="status" className={`mt-3 flex items-center gap-2 text-sm ${msg.ok ? "text-[#2f7a4a]" : "text-vermilion"}`}>
          {msg.ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />} {msg.text}
        </p>
      )}
    </div>
  );
}
