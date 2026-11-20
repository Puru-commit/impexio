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
const WEEK = 7 * 86_400_000;

/* ───────── overview ───────── */

export async function getStats() {
  const [u] = await one("SELECT COUNT(*) AS total, COALESCE(SUM(created_at >= NOW() - INTERVAL 7 DAY),0) AS week, COALESCE(SUM(last_login_at >= NOW() - INTERVAL 7 DAY),0) AS active FROM users");
  const [paid] = await one("SELECT COUNT(*) AS n FROM subscriptions WHERE status IN ('active','cancelled') AND current_period_end > NOW()");
  const [soon] = await one("SELECT COUNT(*) AS n FROM subscriptions WHERE status IN ('active','cancelled') AND current_period_end > NOW() AND current_period_end <= NOW() + INTERVAL 7 DAY");
  const [rev] = await one("SELECT COALESCE(SUM(amount_paise),0) AS total, COALESCE(SUM(CASE WHEN paid_at >= NOW() - INTERVAL 30 DAY THEN amount_paise END),0) AS month, COUNT(*) AS n FROM payments WHERE status = 'paid'");
  const [noDocs] = await one("SELECT COUNT(*) AS n FROM users u WHERE NOT EXISTS (SELECT 1 FROM documents d WHERE d.user_id = u.id)");
  const [noProfile] = await one("SELECT COUNT(*) AS n FROM users u WHERE NOT EXISTS (SELECT 1 FROM companies c WHERE c.user_id = u.id AND c.company_name IS NOT NULL AND c.company_name <> '')");
  const docStatus = await one("SELECT status, COUNT(*) AS n FROM documents GROUP BY status");
  const byTool = await one("SELECT doc_type, COUNT(*) AS n FROM documents GROUP BY doc_type ORDER BY n DESC");
  const signups = await one("SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS n FROM users WHERE created_at >= CURDATE() - INTERVAL 13 DAY GROUP BY d");
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() + 5.5 * 3_600_000 - (13 - i) * 86_400_000).toISOString().slice(0, 10);
    return { d, n: Number(signups.find((r) => r.d === d)?.n ?? 0) };
  });
  const count = (s: string) => Number(docStatus.find((r) => r.status === s)?.n ?? 0);
  const users = Number(u.total ?? 0);
  const paidUsers = Number(paid.n ?? 0);
  return {
    users, usersWeek: Number(u.week ?? 0), activeWeek: Number(u.active ?? 0), paidUsers, freeUsers: Math.max(0, users - paidUsers),
    endingSoon: Number(soon.n ?? 0), noDocs: Number(noDocs.n ?? 0), noProfile: Number(noProfile.n ?? 0),
    revenue: Number(rev.total) / 100, revenueMonth: Number(rev.month) / 100, payments: Number(rev.n),
    docs: { draft: count("draft"), final: count("final"), cancelled: count("cancelled") },
    byTool: byTool.map((r) => ({ slug: String(r.doc_type), n: Number(r.n) })),
    signups: last14,
  };
}

/* ───────── customers ───────── */

export type AdminUser = {
  id: number; name: string; email: string; role: string; image: string; joined: string; lastLogin: string;
  company: string; phone: string; country: string; city: string;
  plan: string; freeUsed: number; paidUntil: string; endingSoon: boolean; paidTotal: number; docs: number; finalDocs: number;
};

const mapUser = (r: RowDataPacket, now: number): AdminUser => {
  const end = r.current_period_end ? new Date(r.current_period_end) : null;
  const paid = (r.status === "active" || r.status === "cancelled") && !!end && end.getTime() > now;
  return {
    id: Number(r.id), name: String(r.name ?? ""), email: String(r.email), role: String(r.role), image: String(r.image_url ?? ""),
    joined: new Date(r.created_at).toISOString(), lastLogin: r.last_login_at ? new Date(r.last_login_at).toISOString() : "",
    company: String(r.company_name ?? ""), phone: String(r.phone ?? ""), country: String(r.country ?? ""), city: String(r.city ?? ""),
    plan: paid ? "paid" : "free", freeUsed: Number(r.free_docs_used ?? 0), paidUntil: paid && end ? end.toISOString() : "",
    endingSoon: paid && !!end && end.getTime() <= now + WEEK, paidTotal: Number(r.paid_total ?? 0) / 100,
    docs: Number(r.docs ?? 0), finalDocs: Number(r.final_docs ?? 0),
  };
};

const USER_SQL = `SELECT u.id, u.name, u.email, u.role, u.image_url, u.created_at, u.last_login_at,
    s.status, s.free_docs_used, s.current_period_end, c.company_name, c.phone, c.country, c.city,
    (SELECT COALESCE(SUM(p.amount_paise),0) FROM payments p WHERE p.user_id = u.id AND p.status = 'paid') AS paid_total,
    (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id) AS docs,
    (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND d.status = 'final') AS final_docs
  FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id LEFT JOIN companies c ON c.user_id = u.id`;

export async function listUsers(limit = 500): Promise<AdminUser[]> {
  const rows = await one(`${USER_SQL} ORDER BY u.id DESC LIMIT ${Math.min(500, Math.max(1, limit))}`);
  const now = Date.now();
  return rows.map((r) => mapUser(r, now));
}

export async function getCustomer(id: number) {
  if (!Number.isInteger(id) || id < 1) return null;
  const rows = await one(`${USER_SQL} WHERE u.id = ? LIMIT 1`, [id]);
  if (!rows[0]) return null;
  const user = mapUser(rows[0], Date.now());
  const [co] = await one("SELECT address, state, pincode, email, website, gstin, iec_code FROM companies WHERE user_id = ? LIMIT 1", [id]);
  const byTool = await one("SELECT doc_type, status, COUNT(*) AS n FROM documents WHERE user_id = ? GROUP BY doc_type, status", [id]);
  const lastDoc = await one("SELECT MAX(updated_at) AS t FROM documents WHERE user_id = ?", [id]);
  const pays = await one("SELECT razorpay_payment_id, razorpay_order_id, amount_paise, status, created_at, paid_at FROM payments WHERE user_id = ? ORDER BY id DESC LIMIT 50", [id]);
  return {
    user,
    company: {
      address: String(co?.address ?? ""), state: String(co?.state ?? ""), pincode: String(co?.pincode ?? ""), email: String(co?.email ?? ""),
      website: String(co?.website ?? ""), gstin: String(co?.gstin ?? ""), iec: String(co?.iec_code ?? ""),
    },
    lastDoc: lastDoc[0]?.t ? new Date(lastDoc[0].t).toISOString() : "",
    docsByTool: byTool.map((r) => ({ slug: String(r.doc_type), status: String(r.status), n: Number(r.n) })),
    payments: pays.map((r) => ({
      id: String(r.razorpay_payment_id ?? r.razorpay_order_id), amount: Number(r.amount_paise) / 100, status: String(r.status),
      at: new Date(r.paid_at ?? r.created_at).toISOString(),
    })),
  };
}

/* ───────── payments ───────── */

export async function listAllPayments(limit = 200) {
  const rows = await one(
    `SELECT p.user_id, p.razorpay_payment_id, p.razorpay_order_id, p.amount_paise, p.status, p.created_at, p.paid_at, u.email, u.name
     FROM payments p JOIN users u ON u.id = p.user_id ORDER BY p.id DESC LIMIT ${Math.min(500, Math.max(1, limit))}`,
  );
  return rows.map((r) => ({
    userId: Number(r.user_id), id: String(r.razorpay_payment_id ?? r.razorpay_order_id), email: String(r.email), name: String(r.name ?? ""),
    amount: Number(r.amount_paise) / 100, status: String(r.status), at: new Date(r.paid_at ?? r.created_at).toISOString(),
  }));
}

/* ───────── actions ───────── */

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
