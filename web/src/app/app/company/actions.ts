"use server";

import { auth } from "@/auth";
import { COMPANY_FIELDS, emptyCompany, saveCompany } from "@/lib/company";

export type SaveState = { ok: boolean; message: string } | null;

export async function saveCompanyAction(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const session = await auth();
  const userId = Number(session?.user?.id);
  if (!userId) return { ok: false, message: "Please log in again." };

  const values = emptyCompany();
  for (const [k, , max] of COMPANY_FIELDS) {
    const v = String(formData.get(k) ?? "").trim();
    if (v.length > max) {
      return { ok: false, message: `One of the fields is too long (max ${max} characters).` };
    }
    values[k] = v;
  }

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { ok: false, message: "Please enter a valid company email." };
  }
  values.gstin = values.gstin.toUpperCase();
  values.pan = values.pan.toUpperCase();
  values.bankIfsc = values.bankIfsc.toUpperCase();

  try {
    await saveCompany(userId, values);
    return { ok: true, message: "Company profile saved." };
  } catch {
    return { ok: false, message: "Could not save. Is the database running?" };
  }
}
