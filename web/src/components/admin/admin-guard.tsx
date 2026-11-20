import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { currentUserId } from "@/lib/session";

/** Wrap every admin page in this. Normal users get "not found", so they never learn the page exists. */
export async function AdminGuard({ children }: { children: React.ReactNode }) {
  await connection();
  const me = await currentUserId();
  if (!me) return null;
  let ok = false;
  try {
    ok = await isAdmin(me);
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex items-start gap-3 rounded-2xl border border-vermilion/40 bg-vermilion/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-vermilion" /> Could not reach the database. Start Laragon and refresh.
        </div>
      </div>
    );
  }
  if (!ok) notFound();
  return <>{children}</>;
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
export const dateIn = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "—");
export const dateTimeIn = (iso: string) => (iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) : "—");
