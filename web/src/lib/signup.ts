import { db } from "@/lib/db";

export const SIGNUP_COOKIE = "impexio_signup";
import { BUSINESS_TYPES, TRADE_TYPES } from "@/lib/signup-options";

export type Signup = {
  fullName: string; companyName: string; tradeType: string; businessType: string;
  mainProduct: string; phone: string; iecCode: string;
};

const clean = (v: unknown, n: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

/** Checks what the register form sent. Returns an error text or the clean values. */
export function readSignup(fd: FormData): { error: string } | { value: Signup } {
  const s: Signup = {
    fullName: clean(fd.get("fullName"), 120),
    companyName: clean(fd.get("companyName"), 255),
    tradeType: clean(fd.get("tradeType"), 20),
    businessType: clean(fd.get("businessType"), 40),
    mainProduct: clean(fd.get("mainProduct"), 160),
    phone: clean(fd.get("phone"), 40),
    iecCode: clean(fd.get("iecCode"), 30).toUpperCase(),
  };
  if (s.fullName.length < 2) return { error: "Please enter your full name." };
  if (s.companyName.length < 2) return { error: "Please enter your business name." };
  if (!(TRADE_TYPES as readonly string[]).includes(s.tradeType)) return { error: "Please choose Exporter, Importer or Both." };
  if (!(BUSINESS_TYPES as readonly string[]).includes(s.businessType)) return { error: "Please choose your business type." };
  if (s.phone && !/^[0-9+()\-\s]{7,20}$/.test(s.phone)) return { error: "That phone number does not look right." };
  if (s.iecCode && !/^[A-Z0-9]{6,15}$/.test(s.iecCode)) return { error: "An IEC code is letters and numbers only." };
  if (fd.get("agree") !== "on") return { error: "Please accept the Terms and Privacy Policy to continue." };
  return { value: s };
}

/** Saves the details once. A later sign-in never overwrites them. */
export async function saveSignup(userId: number, s: Signup) {
  await db.execute(
    `INSERT IGNORE INTO user_onboarding (user_id, full_name, company_name, trade_type, business_type, main_product, phone, iec_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, s.fullName, s.companyName, s.tradeType, s.businessType, s.mainProduct || null, s.phone || null, s.iecCode || null],
  );
  // Pre-fill the master profile, only if the user has none yet.
  await db.execute(
    "INSERT IGNORE INTO companies (user_id, company_name, phone, iec_code, prepared_by) VALUES (?, ?, ?, ?, ?)",
    [userId, s.companyName, s.phone || null, s.iecCode || null, s.fullName],
  );
}
