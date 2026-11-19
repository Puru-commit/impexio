import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { AlertTriangle, Check } from "lucide-react";
import { listPayments } from "@/lib/billing";
import { FREE_DOCUMENT_LIMIT, getPlan, type Plan } from "@/lib/plan";
import { razorpayConfigured } from "@/lib/razorpay";
import { currentUserId } from "@/lib/session";
import { PayButton } from "./pay-button";

export const metadata: Metadata = { title: "Plan & billing — IMPEXIO" };

const day = (d: Date) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
const PERKS = ["Unlimited documents, letters and calculators", "All 12 tools and every PDF download", "Master profile, numbering and carry-forward", "New tools as they are added"];

async function Content() {
  await connection();
  const userId = await currentUserId();
  if (!userId) return null;

  let plan: Plan | null = null;
  let pays: Awaited<ReturnType<typeof listPayments>> = [];
  let dbError = false;
  try {
    plan = await getPlan(userId);
    pays = await listPayments(userId);
  } catch {
    dbError = true;
  }
  const configured = razorpayConfigured();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Plan & billing</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Your plan</h1>

      {dbError && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" /> Could not reach the database. Start Laragon and refresh.</div>}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-border bg-white/90 p-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Right now</p>
          <h2 className="mt-3 text-2xl font-semibold">{plan?.paid ? "Monthly plan" : "Free trial"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {!plan ? "Plan details are not available." : plan.paid ? `Active until ${plan.periodEnd ? day(plan.periodEnd) : ""}.` : `${plan.freeDocsUsed} of ${FREE_DOCUMENT_LIMIT} free document used.${plan.status === "active" || plan.status === "cancelled" ? " Your last paid month has ended." : ""}`}
          </p>
        </section>

        <section className="dark relative overflow-hidden rounded-3xl border border-brass/40 bg-ink p-7 text-foreground">
          <div aria-hidden className="absolute -right-12 -top-12 size-48 rounded-full bg-brass/25 blur-3xl" />
          <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-brass-light">Monthly plan</p>
          <p className="relative mt-3 text-4xl font-semibold">₹249 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
          <ul className="relative mt-4 space-y-2 text-sm">
            {PERKS.map((p) => <li key={p} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-brass-light" /> {p}</li>)}
          </ul>
          <div className="relative mt-6">
            {configured ? <PayButton label={plan?.paid ? "Add another month — ₹249" : "Pay ₹249"} /> : <p className="rounded-xl border border-white/15 bg-white/5 p-3 text-sm">Payments are not switched on yet. Add your Razorpay <b>test</b> keys to <code>.env.local</code> and restart the server.</p>}
          </div>
          <p className="relative mt-4 text-xs text-muted-foreground">Each payment adds 30 days. It does not renew by itself.</p>
        </section>
      </div>

      {configured && process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_") && (
        <div className="mt-6 rounded-2xl border border-dashed border-brass/60 bg-white/70 p-5 text-sm">
          <b>Test mode.</b> No real money moves. Use card <code>4111 1111 1111 1111</code>, any future expiry, any 3-digit CVV, and any OTP. For UPI use <code>success@razorpay</code>.
        </div>
      )}

      <h2 className="mt-10 text-lg font-semibold">Payment history</h2>
      {pays.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No payments yet.</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white/90">
          <table className="w-full min-w-[520px] text-sm">
            <thead><tr className="border-b border-border bg-paper/70 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-3">Date</th><th className="px-3 py-3">Payment id</th><th className="px-3 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Status</th></tr></thead>
            <tbody>
              {pays.map((p) => (
                <tr key={p.order} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">{day(p.at)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{p.payment || "—"}</td>
                  <td className="px-3 py-3 text-right font-mono">₹{p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right"><span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase ${p.status === "paid" ? "border-[#2f7a4a]/40 text-[#2f7a4a]" : "border-border text-muted-foreground"}`}>{p.status === "paid" ? "Paid" : "Not completed"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Content /></Suspense>;
}
