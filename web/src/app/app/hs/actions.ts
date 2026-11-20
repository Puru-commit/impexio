"use server";

import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import type { HsHit } from "@/lib/hs";
import { currentUserId } from "@/lib/session";

export type HsResult = { ok: boolean; rows: HsHit[]; total?: number; message?: string };

const esc = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Search by code (digits) or by words in the product name. */
export async function searchHsAction(query: string): Promise<HsResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, rows: [], message: "Please log in again." };
  const q = String(query ?? "").trim().slice(0, 80);
  if (q.length < 2) return { ok: true, rows: [] };

  try {
    let sql: string;
    let params: (string | number)[];
    if (/^[\d.\s]+$/.test(q)) {
      const digits = q.replace(/\D/g, "");
      if (digits.length < 2) return { ok: true, rows: [] };
      sql = "SELECT code, level, description, heading, context FROM hs_codes WHERE code LIKE ? ORDER BY code, level LIMIT 60";
      params = [`${digits}%`];
    } else {
      const words = [...new Set(q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2))].slice(0, 6);
      if (!words.length) return { ok: true, rows: [] };
      const hay = "CONCAT_WS(' ', description, heading, context)";
      const where = words.map(() => `${hay} LIKE ?`).join(" AND ");
      const score = words.map(() => "(description LIKE ?)").join(" + ");
      sql = `SELECT code, level, description, heading, context FROM hs_codes WHERE ${where} ORDER BY (${score}) DESC, level DESC, code LIMIT 60`;
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
    return { ok: false, rows: [], message: "Could not search. Is the database running and the HS data loaded?" };
  }
}
