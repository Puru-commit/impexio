"use server";

import { TOOL_DEFS } from "@/lib/doc/defs";
import { carryForward, coFrom, sanitize, todayIso } from "@/lib/doc/core";
import { cancelDocument, createDocument, finaliseDocument, getDocument, isDuplicate, nextRef, updateDocument } from "@/lib/documents";
import { getCompany } from "@/lib/company";
import { currentUserId } from "@/lib/session";

export type DocResult = { ok: boolean; id?: number; message: string };
const LOGIN: DocResult = { ok: false, message: "Please log in again." };
const DB: DocResult = { ok: false, message: "Could not reach the database. Is Laragon running?" };

export async function saveDocumentAction(id: number | null, slug: string, raw: unknown): Promise<DocResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN;
  const def = TOOL_DEFS[slug];
  if (!def) return { ok: false, message: "Unknown document type." };
  try {
    const data = sanitize(def, raw);
    const title = def.docTitle(data.f);
    if (id) {
      const ok = await updateDocument(userId, id, title, data);
      return ok ? { ok: true, id, message: "Saved." } : { ok: false, message: "This document is final or cancelled, so it cannot be changed. Use Duplicate to make a copy." };
    }
    return { ok: true, id: await createDocument(userId, slug, title, data), message: "Saved." };
  } catch (e) {
    if (isDuplicate(e)) return { ok: false, message: `The number ${sanitize(def, raw).f.ref} is already used. Please type a different number.` };
    return DB;
  }
}

export async function finaliseDocumentAction(id: number): Promise<DocResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN;
  try {
    const r = await finaliseDocument(userId, id);
    if (r === "ok") return { ok: true, id, message: "Document is final. You can download the PDF." };
    if (r === "limit") return { ok: false, message: "Your free document is already used. Upgrade to create more." };
    if (r === "incomplete") return { ok: false, message: "Some required boxes are still empty. Save, then fill them in." };
    return { ok: false, message: "Document not found." };
  } catch { return DB; }
}

export async function cancelDocumentAction(id: number): Promise<DocResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN;
  try {
    return (await cancelDocument(userId, id)) ? { ok: true, id, message: "Cancelled." } : { ok: false, message: "Document not found." };
  } catch { return DB; }
}

/** Copy a document into a new draft (same type, or the next document in the chain). */
export async function carryForwardAction(id: number, targetSlug?: string): Promise<DocResult> {
  const userId = await currentUserId();
  if (!userId) return LOGIN;
  try {
    const src = await getDocument(userId, id);
    if (!src) return { ok: false, message: "Document not found." };
    const srcDef = TOOL_DEFS[src.docType];
    const slug = targetSlug ?? src.docType;
    const tgt = TOOL_DEFS[slug];
    if (!tgt || (slug !== src.docType && !srcDef.next?.includes(slug))) return { ok: false, message: "That is not possible." };
    const master = await getCompany(userId);
    const ctx = { today: todayIso(), ref: await nextRef(userId, slug) };
    const data = carryForward(srcDef, src.data, tgt, master, ctx);
    if (slug === src.docType) data.f = { ...src.data.f, ref: ctx.ref, date: ctx.today };
    return { ok: true, id: await createDocument(userId, slug, tgt.docTitle(data.f), data), message: "New draft created." };
  } catch { return DB; }
}

/** Latest company details from the master profile (for drafts). */
export async function masterCompanyAction() {
  const userId = await currentUserId();
  if (!userId) return null;
  try { return coFrom(await getCompany(userId)); } catch { return null; }
}
