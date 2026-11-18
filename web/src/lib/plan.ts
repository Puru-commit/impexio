import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "@/lib/db";

export const FREE_DOCUMENT_LIMIT = 1;

export type Plan = {
  status: "free" | "active" | "cancelled" | "expired";
  freeDocsUsed: number;
  periodEnd: Date | null;
  /** True when the user may generate another document right now. */
  canGenerate: boolean;
};

type Row = RowDataPacket & {
  status: Plan["status"];
  free_docs_used: number;
  current_period_end: Date | null;
};

/** Reads the user's plan from the database. The server decides, never the browser. */
export async function getPlan(userId: number): Promise<Plan> {
  const [rows] = await db.execute<Row[]>(
    "SELECT status, free_docs_used, current_period_end FROM subscriptions WHERE user_id = ? LIMIT 1",
    [userId],
  );
  const r = rows[0];
  const status = r?.status ?? "free";
  const freeDocsUsed = r?.free_docs_used ?? 0;
  const periodEnd = r?.current_period_end ?? null;

  const paidAndCurrent =
    (status === "active" || status === "cancelled") &&
    !!periodEnd &&
    periodEnd.getTime() > Date.now();

  return {
    status,
    freeDocsUsed,
    periodEnd,
    canGenerate: paidAndCurrent || freeDocsUsed < FREE_DOCUMENT_LIMIT,
  };
}

/**
 * Call this when a document is finalised. It is a single atomic UPDATE, so two
 * browser tabs cannot both use the one free document.
 * Returns true if the document is allowed.
 */
export async function consumeDocumentAllowance(userId: number): Promise<boolean> {
  const plan = await getPlan(userId);
  const paidAndCurrent =
    (plan.status === "active" || plan.status === "cancelled") &&
    !!plan.periodEnd &&
    plan.periodEnd.getTime() > Date.now();
  if (paidAndCurrent) return true;

  const [res] = await db.execute<ResultSetHeader>(
    "UPDATE subscriptions SET free_docs_used = free_docs_used + 1 WHERE user_id = ? AND free_docs_used < ?",
    [userId, FREE_DOCUMENT_LIMIT],
  );
  return res.affectedRows === 1;
}
