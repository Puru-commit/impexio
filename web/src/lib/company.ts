import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

// formName, database column, max length
export const COMPANY_FIELDS = [
  ["companyName", "company_name", 255],
  ["address", "address", 500],
  ["city", "city", 120],
  ["state", "state", 120],
  ["country", "country", 120],
  ["pincode", "pincode", 20],
  ["phone", "phone", 40],
  ["email", "email", 255],
  ["website", "website", 255],
  ["gstin", "gstin", 30],
  ["iecCode", "iec_code", 30],
  ["pan", "pan", 20],
  ["bankName", "bank_name", 255],
  ["bankAccountName", "bank_account_name", 255],
  ["bankAccountNo", "bank_account_no", 60],
  ["bankIfsc", "bank_ifsc", 30],
  ["bankSwift", "bank_swift", 30],
] as const;

export type CompanyValues = Record<(typeof COMPANY_FIELDS)[number][0], string>;

export function emptyCompany(): CompanyValues {
  return Object.fromEntries(COMPANY_FIELDS.map(([k]) => [k, ""])) as CompanyValues;
}

export async function getCompany(userId: number): Promise<CompanyValues> {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT * FROM companies WHERE user_id = ? LIMIT 1",
    [userId],
  );
  const out = emptyCompany();
  const row = rows[0];
  if (row) for (const [k, col] of COMPANY_FIELDS) out[k] = row[col] ?? "";
  return out;
}

export async function saveCompany(userId: number, v: CompanyValues) {
  const cols = COMPANY_FIELDS.map(([, c]) => c);
  const sql = `INSERT INTO companies (user_id, ${cols.join(", ")})
     VALUES (?, ${cols.map(() => "?").join(", ")})
     ON DUPLICATE KEY UPDATE ${cols.map((c) => `${c} = VALUES(${c})`).join(", ")}`;
  await db.execute(sql, [
    userId,
    ...COMPANY_FIELDS.map(([k]) => v[k] || null),
  ]);
}

/** Share of the important fields that are filled in, for the dashboard. */
export function companyCompleteness(v: CompanyValues) {
  const key: (keyof CompanyValues)[] = [
    "companyName", "address", "country", "phone", "email", "bankName", "bankAccountNo",
  ];
  const done = key.filter((k) => v[k].trim()).length;
  return Math.round((done / key.length) * 100);
}
