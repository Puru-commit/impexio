"use server";

import { searchHs, type HsResult } from "@/lib/hs-search";
import { currentUserId } from "@/lib/session";

export type { HsResult };

/** For logged-in users (inside the app and inside documents). */
export async function searchHsAction(query: string): Promise<HsResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, rows: [], message: "Please log in again." };
  return searchHs(query, 60);
}
