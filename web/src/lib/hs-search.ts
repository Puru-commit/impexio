import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import type { HsHit } from "@/lib/hs";

export type HsResult = { ok: boolean; rows: HsHit[]; message?: string };

const esc = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Search the HS list by code (digits) or by words in the product name. */
export async function searchHs(query: string, limit = 60): Promise<HsResult> {
  const q = String(query ?? "").trim().slice(0, 80);
  if (q.length < 2) return { ok: true, rows: [] };
  const lim = Math.min(60, Math.max(1, Math.floor(limit)));

  try {
    let sql: string;
    let params: (string | number)[];
    if (/^[\d.\s]+$/.test(q)) {
      const digits = q.replace(/\D/g, "");
      if (digits.length < 2) return { ok: true, rows: [] };
      sql = `SELECT code, level, description, heading, context FROM hs_codes WHERE code LIKE ? ORDER BY code, level LIMIT ${lim}`;
      params = [`${digits}%`];
    } else {
      const words = [...new Set(q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2))].slice(0, 6);
      if (!words.length) return { ok: true, rows: [] };
      const hay = "CONCAT_WS(' ', description, heading, context)";
      const where = words.map(() => `${hay} LIKE ?`).join(" AND ");
      const score = words.map(() => "(description LIKE ?)").join(" + ");
      sql = `SELECT code, level, description, heading, context FROM hs_codes WHERE ${where} ORDER BY (${score}) DESC, level DESC, code LIMIT ${lim}`;
      params = [...words.map((w) => `%${esc(w)}%`), ...words.map((w) => `%${esc(w)}%`)];
    }
    const [rows] = await db.execute<RowDataPacket[]>(sql, params);
    if (rows.length === 0) {
      const [c] = await db.execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM hs_codes");
      if (Number(c[0]?.n ?? 0) === 0) return { ok: false, rows: [], message: "The HS code list is not loaded yet." };
    }
    return {
      ok: true,
      rows: rows.map((r) => ({ code: String(r.code), level: Number(r.level), desc: String(r.description ?? ""), heading: String(r.heading ?? ""), context: String(r.context ?? "") })),
    };
  } catch {
    return { ok: false, rows: [], message: "Search is not available right now." };
  }
}
