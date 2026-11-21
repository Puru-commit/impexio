"use server";

import { searchHs, type HsResult } from "@/lib/hs-search";
import { currentUserId } from "@/lib/session";

export type { HsResult };

/** For logged-in users (inside the app and inside documents). */
export async function searchHsAction(query: string, page: number): Promise<HsResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, rows: [], total: 0, page: 1, pages: 0, message: "Please log in again." };
  return searchHs(query, page);
}
