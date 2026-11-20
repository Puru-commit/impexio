import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { PLAN_DAYS } from "@/lib/razorpay";

/** Checked in the database on every request, so removing admin rights works at once. */
export async function isAdmin(userId: number) {
  if (!Number.isInteger(userId) || userId < 1) return false;
  const [rows] = await db.execute<RowDataPacket[]>("SELECT role FROM users WHERE id = ? LIMIT 1", [userId]);
  return rows[0]?.role === "admin";
}

const one = async (sql: string, params: unknown[] = []) => {
  const [rows] = await db.execute<RowDataPacket[]>(sql, params as never[]);
  return rows;
};

export async function getStats() {
  const [u] = await one("SELECT COUNT(*) AS total, SUM(created_at >= NOW() - INTERVAL 7 DAY) AS week FROM users");
  const [paid] = await one("SELECT COUNT(*) AS n FROM subscriptions WHERE status IN ('active','cancelled') AND current_period_end > NOW()");
  const [rev] = await one("SELECT COALESCE(SUM(amount_paise),0) AS total, COALESCE(SUM(CASE WHEN paid_at >= NOW() - INTERVAL 30 DAY THEN amount_paise END),0) AS month, COUNT(*) AS n FROM payments WHERE status = 'paid'");
  const docStatus = await one("SELECT status, COUNT(*) AS n FROM documents GROUP BY status");
  const byTool = await one("SELECT doc_type, COUNT(*) AS n FROM documents GROUP BY doc_type ORDER BY n DESC");
  const signups = await one("SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS n FROM users WHERE created_at >= CURDATE() - INTERVAL 13 DAY GROUP BY d");
  // last 14 days (India time), including days with zero signups
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() + 5.5 * 3_600_000 - (13 - i) * 86_400_000).toISOString().slice(0, 10);
    return { d, n: Number(signups.find((r) => r.d === d)?.n ?? 0) };
  });
  const count = (s: string) => Number(docStatus.find((r) => r.status === s)?.n ?? 0);
  return {
    users: Number(u.total ?? 0), usersWeek: Number(u.week ?? 0), paidUsers: Number(paid.n ?? 0),
    revenue: Number(rev.total) / 100, revenueMonth: Number(rev.month) / 100, payments: Number(rev.n),
    docs: { draft: count("draft"), final: count("final"), cancelled: count("cancelled") },
    byTool: byTool.map((r) => ({ slug: String(r.doc_type), n: Number(r.n) })),
    signups: last14,
  };
}

export type AdminUser = {
  id: number; name: string; email: string; role: string; joined: string; lastLogin: string;
  plan: string; freeUsed: number; paidUntil: string; docs: number;
};

export async function listUsers(): Promise<AdminUser[]> {
  const rows = await one(
    `SELECT u.id, u.name, u.email, u.role, u.created_at, u.last_login_at, s.status, s.free_docs_used, s.current_period_end,
            (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id) AS docs
     FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id ORDER BY u.id DESC LIMIT 500`,
  );
  const now = Date.now();
  return rows.map((r) => {
    const end = r.current_period_end ? new Date(r.current_period_end) : null;
    const paid = (r.status === "active" || r.status === "cancelled") && !!end && end.getTime() > now;
    return {
      id: Number(r.id), name: String(r.name ?? ""), email: String(r.email), role: String(r.role),
      joined: new Date(r.created_at).toISOString(), lastLogin: r.last_login_at ? new Date(r.last_login_at).toISOString() : "",
      plan: paid ? "paid" : "free", freeUsed: Number(r.free_docs_used ?? 0), paidUntil: paid && end ? end.toISOString() : "", docs: Number(r.docs ?? 0),
    };
  });
}

export async function listAllPayments() {
  const rows = await one(
    `SELECT p.razorpay_payment_id, p.razorpay_order_id, p.amount_paise, p.status, p.created_at, p.paid_at, u.email
     FROM payments p JOIN users u ON u.id = p.user_id ORDER BY p.id DESC LIMIT 100`,
  );
  return rows.map((r) => ({
    id: String(r.razorpay_payment_id ?? r.razorpay_order_id), email: String(r.email), amount: Number(r.amount_paise) / 100,
    status: String(r.status), at: new Date(r.paid_at ?? r.created_at).toISOString(),
  }));
}

/** Adds days to a user's plan (starting after any days they still have). */
export async function grantDays(userId: number, days = PLAN_DAYS) {
  const [sub] = await db.execute<RowDataPacket[]>("SELECT current_period_end FROM subscriptions WHERE user_id = ? LIMIT 1", [userId]);
  const cur = sub[0]?.current_period_end ? new Date(sub[0].current_period_end).getTime() : 0;
  const end = new Date(Math.max(Date.now(), cur) + days * 86_400_000);
  await db.execute(
    `INSERT INTO subscriptions (user_id, status, current_period_end) VALUES (?, 'active', ?)
     ON DUPLICATE KEY UPDATE status = 'active', current_period_end = VALUES(current_period_end)`,
    [userId, end],
  );
}

export async function revokePlan(userId: number) {
  await db.execute("UPDATE subscriptions SET status = 'expired', current_period_end = NOW() WHERE user_id = ?", [userId]);
}

export async function resetFreeDocs(userId: number) {
  const [res] = await db.execute<ResultSetHeader>("UPDATE subscriptions SET free_docs_used = 0 WHERE user_id = ?", [userId]);
  return res.affectedRows >= 0;
}
