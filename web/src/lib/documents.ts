import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { consumeDocumentAllowance } from "@/lib/plan";

export type DocRow = {
  id: number;
  docType: string;
  title: string;
  status: "draft" | "final";
  data: unknown;
  updatedAt: Date;
};

type Row = RowDataPacket & {
  id: number;
  doc_type: string;
  title: string;
  status: "draft" | "final";
  data: string;
  updated_at: Date;
};

export async function createDocument(userId: number, docType: string, title: string, data: unknown) {
  const [res] = await db.execute<ResultSetHeader>(
    "INSERT INTO documents (user_id, doc_type, title, data) VALUES (?, ?, ?, ?)",
    [userId, docType, title, JSON.stringify(data)],
  );
  return res.insertId;
}

export async function updateDocument(userId: number, id: number, title: string, data: unknown) {
  const [res] = await db.execute<ResultSetHeader>(
    "UPDATE documents SET title = ?, data = ? WHERE id = ? AND user_id = ?",
    [title, JSON.stringify(data), id, userId],
  );
  return res.affectedRows === 1 || /matched:\s*1/i.test(res.info);
}

/** Always filters by user_id, so one account can never read another's documents. */
export async function getDocument(userId: number, id: number): Promise<DocRow | null> {
  const [rows] = await db.execute<Row[]>(
    "SELECT id, doc_type, title, status, data, updated_at FROM documents WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    docType: r.doc_type,
    title: r.title,
    status: r.status,
    data: JSON.parse(r.data),
    updatedAt: r.updated_at,
  };
}

export async function listDocuments(userId: number, docType: string) {
  const [rows] = await db.execute<Row[]>(
    "SELECT id, doc_type, title, status, updated_at FROM documents WHERE user_id = ? AND doc_type = ? ORDER BY updated_at DESC LIMIT 50",
    [userId, docType],
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    updatedAt: r.updated_at,
  }));
}

/**
 * Marks a draft as final. This is where the free-document limit is enforced.
 * A document that is already final does not use the allowance again.
 */
export async function finaliseDocument(userId: number, id: number): Promise<"ok" | "limit" | "missing"> {
  const doc = await getDocument(userId, id);
  if (!doc) return "missing";
  if (doc.status === "final") return "ok";
  if (!(await consumeDocumentAllowance(userId))) return "limit";
  await db.execute("UPDATE documents SET status = 'final' WHERE id = ? AND user_id = ?", [id, userId]);
  return "ok";
}
