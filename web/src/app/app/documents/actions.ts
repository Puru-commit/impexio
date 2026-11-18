"use server";

import { GENERATORS } from "@/lib/generators";
import { createDocument, finaliseDocument, updateDocument } from "@/lib/documents";
import { currentUserId } from "@/lib/session";

export type DocResult = { ok: boolean; id?: number; message: string };

export async function saveDocumentAction(
  id: number | null,
  docType: string,
  raw: unknown,
): Promise<DocResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, message: "Please log in again." };

  const gen = GENERATORS[docType];
  if (!gen) return { ok: false, message: "Unknown document type." };

  try {
    const data = gen.sanitize(raw);
    const title = gen.title(data as never);
    if (id) {
      const ok = await updateDocument(userId, id, title, data);
      return ok ? { ok: true, id, message: "Saved." } : { ok: false, message: "Document not found." };
    }
    const newId = await createDocument(userId, docType, title, data);
    return { ok: true, id: newId, message: "Saved." };
  } catch {
    return { ok: false, message: "Could not save. Is the database running?" };
  }
}

export async function finaliseDocumentAction(id: number): Promise<DocResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, message: "Please log in again." };
  try {
    const r = await finaliseDocument(userId, id);
    if (r === "ok") return { ok: true, id, message: "Document is final." };
    if (r === "limit") {
      return { ok: false, message: "Your free document is already used. Upgrade to create more." };
    }
    return { ok: false, message: "Document not found." };
  } catch {
    return { ok: false, message: "Could not finalise. Is the database running?" };
  }
}
