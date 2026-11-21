import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import type { HsHit } from "@/lib/hs";

export const HS_PAGE_SIZE = 9;
export type HsResult = { ok: boolean; rows: HsHit[]; total: number; page: number; pages: number; message?: string };

const empty = (message?: string, ok = true): HsResult => ({ ok, rows: [], total: 0, page: 1, pages: 0, message });
const esc = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Search the HS list by code (digits) or by words in the product name. 9 results per page. */
export async function searchHs(query: string, page = 1): Promise<HsResult> {
  const q = String(query ?? "").trim().slice(0, 80);
  if (q.length < 2) return empty();
  const pg = Math.min(5000, Math.max(1, Math.floor(Number(page) || 1)));
  const offset = (pg - 1) * HS_PAGE_SIZE;

  try {
    let where: string;
    let whereParams: string[];
    let order: string;
    let orderParams: string[] = [];

    if (/^[\d.\s]+$/.test(q)) {
      const digits = q.replace(/\D/g, "");
      if (digits.length < 2) return empty();
      where = "code LIKE ?";
      whereParams = [`${digits}%`];
      order = "code, level";
    } else {
      const words = [...new Set(q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2))].slice(0, 6);
      if (!words.length) return empty();
      const hay = "CONCAT_WS(' ', description, heading, context)";
      where = words.map(() => `${hay} LIKE ?`).join(" AND ");
      whereParams = words.map((w) => `%${esc(w)}%`);
      order = `(${words.map(() => "(description LIKE ?)").join(" + ")}) DESC, level DESC, code`;
      orderParams = whereParams;
    }

    const [cnt] = await db.execute<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM hs_codes WHERE ${where}`, whereParams);
    const total = Number(cnt[0]?.n ?? 0);
    if (total === 0) {
      const [c] = await db.execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM hs_codes");
      if (Number(c[0]?.n ?? 0) === 0) return empty("The HS code list is not loaded yet.", false);
      return empty();
    }
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT code, level, description, heading, context FROM hs_codes WHERE ${where} ORDER BY ${order} LIMIT ${HS_PAGE_SIZE} OFFSET ${offset}`,
      [...whereParams, ...orderParams],
    );
    return {
      ok: true, total, page: pg, pages: Math.ceil(total / HS_PAGE_SIZE),
      rows: rows.map((r) => ({ code: String(r.code), level: Number(r.level), desc: String(r.description ?? ""), heading: String(r.heading ?? ""), context: String(r.context ?? "") })),
    };
  } catch {
    return empty("Search is not available right now. Please try again in a moment.", false);
  }
}
