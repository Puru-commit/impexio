import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { consumeDocumentAllowance } from "@/lib/plan";
import { TOOL_DEFS } from "@/lib/doc/defs";
import { readiness, sanitize, todayIso, type DocData } from "@/lib/doc/core";

export type Status = "draft" | "final" | "cancelled";
export type DocRow = { id: number; docType: string; refNo: string; title: string; status: Status; data: DocData; updatedAt: Date };

type Row = RowDataPacket & { id: number; doc_type: string; ref_no: string | null; title: string; status: Status; data: string; updated_at: Date };

const toDoc = (r: Row): DocRow | null => {
  const def = TOOL_DEFS[r.doc_type];
  if (!def) return null;
  let raw: unknown = {};
  try { raw = JSON.parse(r.data); } catch { /* keep empty */ }
  return { id: r.id, docType: r.doc_type, refNo: r.ref_no ?? "", title: r.title, status: r.status, data: sanitize(def, raw), updatedAt: r.updated_at };
};

export const isDuplicate = (e: unknown) => (e as { errno?: number })?.errno === 1062;

/** Next number like PI-2026-0004 for this user and tool. */
export async function nextRef(userId: number, slug: string) {
  const def = TOOL_DEFS[slug];
  const year = todayIso().slice(0, 4);
  const prefix = `${def.prefix}-${year}-`;
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT ref_no FROM documents WHERE user_id = ? AND doc_type = ? AND ref_no LIKE ?",
    [userId, slug, `${prefix}%`],
  );
  let max = 0;
  for (const r of rows) max = Math.max(max, parseInt(String(r.ref_no).slice(prefix.length), 10) || 0);
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export async function createDocument(userId: number, docType: string, title: string, data: DocData) {
  const [res] = await db.execute<ResultSetHeader>(
    "INSERT INTO documents (user_id, doc_type, ref_no, title, data) VALUES (?, ?, ?, ?, ?)",
    [userId, docType, data.f.ref || null, title, JSON.stringify(data)],
  );
  return res.insertId;
}

export async function updateDocument(userId: number, id: number, title: string, data: DocData) {
  const [res] = await db.execute<ResultSetHeader>(
    "UPDATE documents SET title = ?, ref_no = ?, data = ? WHERE id = ? AND user_id = ? AND status = 'draft'",
    [title, data.f.ref || null, JSON.stringify(data), id, userId],
  );
  return res.affectedRows === 1 || /matched:\s*1/i.test(res.info);
}

/** Always filters by user_id, so one account can never read another's documents. */
export async function getDocument(userId: number, id: number): Promise<DocRow | null> {
  const [rows] = await db.execute<Row[]>(
    "SELECT id, doc_type, ref_no, title, status, data, updated_at FROM documents WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId],
  );
  return rows[0] ? toDoc(rows[0]) : null;
}

export async function listDocuments(userId: number, docType: string) {
  const [rows] = await db.execute<Row[]>(
    "SELECT id, doc_type, ref_no, title, status, data, updated_at FROM documents WHERE user_id = ? AND doc_type = ? ORDER BY updated_at DESC LIMIT 200",
    [userId, docType],
  );
  return rows.map(toDoc).filter((x): x is DocRow => !!x);
}

/** Marks a draft as final. This is where the free-document limit is enforced. */
export async function finaliseDocument(userId: number, id: number): Promise<"ok" | "limit" | "missing" | "incomplete"> {
  const doc = await getDocument(userId, id);
  if (!doc) return "missing";
  if (doc.status === "final") return "ok";
  if (doc.status === "cancelled") return "missing";
  const def = TOOL_DEFS[doc.docType];
  if (!readiness(def, doc.data).ready) return "incomplete";
  if (def.counts && !(await consumeDocumentAllowance(userId))) return "limit";
  await db.execute("UPDATE documents SET status = 'final' WHERE id = ? AND user_id = ?", [id, userId]);
  return "ok";
}

export async function cancelDocument(userId: number, id: number) {
  const [res] = await db.execute<ResultSetHeader>(
    "UPDATE documents SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status <> 'cancelled'",
    [id, userId],
  );
  return res.affectedRows === 1 || /matched:\s*1/i.test(res.info);
}
