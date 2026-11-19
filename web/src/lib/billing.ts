import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { PLAN_DAYS, PRICE_PAISE } from "@/lib/razorpay";

export async function recordOrder(userId: number, orderId: string) {
  await db.execute("INSERT INTO payments (user_id, razorpay_order_id, amount_paise) VALUES (?, ?, ?)", [userId, orderId, PRICE_PAISE]);
}

/**
 * Marks the order paid (only once) and gives the user 30 more days.
 * If they still have paid days left, the new month is added after them.
 */
export async function activatePlan(userId: number, orderId: string, paymentId: string): Promise<"ok" | "already" | "missing"> {
  const [res] = await db.execute<ResultSetHeader>(
    "UPDATE payments SET status = 'paid', razorpay_payment_id = ?, paid_at = NOW() WHERE razorpay_order_id = ? AND user_id = ? AND status = 'created'",
    [paymentId, orderId, userId],
  );
  const changed = res.affectedRows === 1 || /changed:\s*1/i.test(res.info);
  if (!changed) {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT status FROM payments WHERE razorpay_order_id = ? AND user_id = ? LIMIT 1", [orderId, userId]);
    return rows[0] ? "already" : "missing";
  }
  const [sub] = await db.execute<RowDataPacket[]>("SELECT current_period_end FROM subscriptions WHERE user_id = ? LIMIT 1", [userId]);
  const now = Date.now();
  const cur = sub[0]?.current_period_end ? new Date(sub[0].current_period_end).getTime() : 0;
  const end = new Date(Math.max(now, cur) + PLAN_DAYS * 86_400_000);
  await db.execute(
    `INSERT INTO subscriptions (user_id, status, current_period_end) VALUES (?, 'active', ?)
     ON DUPLICATE KEY UPDATE status = 'active', current_period_end = VALUES(current_period_end)`,
    [userId, end],
  );
  return "ok";
}

export async function listPayments(userId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT razorpay_order_id, razorpay_payment_id, amount_paise, status, created_at, paid_at FROM payments WHERE user_id = ? ORDER BY id DESC LIMIT 20",
    [userId],
  );
  return rows.map((r) => ({
    order: String(r.razorpay_order_id), payment: (r.razorpay_payment_id as string | null) ?? "", amount: Number(r.amount_paise) / 100,
    status: r.status as "created" | "paid", at: new Date(r.paid_at ?? r.created_at),
  }));
}
