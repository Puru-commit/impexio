"use server";

import { revalidatePath } from "next/cache";
import { grantDays, isAdmin, resetFreeDocs, revokePlan } from "@/lib/admin";
import { currentUserId } from "@/lib/session";

export type AdminResult = { ok: boolean; message: string };

export async function adminUserAction(userId: number, action: "grant" | "revoke" | "reset"): Promise<AdminResult> {
  try {
    const me = await currentUserId();
    if (!me || !(await isAdmin(me))) return { ok: false, message: "Not allowed." };
    if (!Number.isInteger(userId) || userId < 1) return { ok: false, message: "Unknown user." };
    if (action === "grant") await grantDays(userId);
    else if (action === "revoke") await revokePlan(userId);
    else if (action === "reset") await resetFreeDocs(userId);
    else return { ok: false, message: "Unknown action." };
    revalidatePath("/app/admin", "layout");
    return { ok: true, message: action === "grant" ? "30 days added." : action === "revoke" ? "Plan removed." : "Free document reset." };
  } catch {
    return { ok: false, message: "Could not save. Is the database running?" };
  }
}
