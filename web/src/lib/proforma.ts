import type { CompanyValues } from "@/lib/company";

export type Item = {
  description: string;
  hsCode: string;
  qty: number;
  unit: string;
  rate: number;
};

export type Proforma = {
  invoiceNo: string;
  date: string;
  validUntil: string;
  currency: string;
  exporter: { name: string; address: string; phone: string; email: string; gstin: string; iec: string };
  consignee: { name: string; address: string; country: string; phone: string; email: string };
  buyerRef: string;
  incoterm: string;
  portLoading: string;
  portDischarge: string;
  countryOrigin: string;
  countryDestination: string;
  paymentTerms: string;
  deliveryTime: string;
  items: Item[];
  freight: number;
  insurance: number;
  notes: string;
  bank: { name: string; accountName: string; accountNo: string; ifsc: string; swift: string };
};

export const CURRENCIES = ["USD", "EUR", "GBP", "AED", "INR", "AUD", "CAD", "SGD", "JPY", "CNY"];
export const INCOTERMS = ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"];
export const UNITS = ["PCS", "KGS", "MTS", "SET", "BOX", "CTN", "LTR", "MTR", "SQM", "PAIR"];

export function emptyItem(): Item {
  return { description: "", hsCode: "", qty: 1, unit: "PCS", rate: 0 };
}

/** A new invoice, with the exporter and bank filled in from the company profile. */
export function newProforma(c: CompanyValues): Proforma {
  const address = [c.address, c.city, c.state, c.pincode, c.country].filter(Boolean).join(", ");
  return {
    invoiceNo: "",
    date: "",
    validUntil: "",
    currency: "USD",
    exporter: { name: c.companyName, address, phone: c.phone, email: c.email, gstin: c.gstin, iec: c.iecCode },
    consignee: { name: "", address: "", country: "", phone: "", email: "" },
    buyerRef: "",
    incoterm: "FOB",
    portLoading: "",
    portDischarge: "",
    countryOrigin: c.country,
    countryDestination: "",
    paymentTerms: "",
    deliveryTime: "",
    items: [emptyItem()],
    freight: 0,
    insurance: 0,
    notes: "",
    bank: { name: c.bankName, accountName: c.bankAccountName, accountNo: c.bankAccountNo, ifsc: c.bankIfsc, swift: c.bankSwift },
  };
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function lineAmount(i: Item) {
  return round2(i.qty * i.rate);
}

export function totals(d: Pick<Proforma, "items" | "freight" | "insurance">) {
  const subtotal = round2(d.items.reduce((s, i) => s + lineAmount(i), 0));
  const total = round2(subtotal + d.freight + d.insurance);
  return { subtotal, total };
}

const fmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const money = (n: number) => fmt.format(n);

// ---------- Cleaning data that comes from the browser ----------

const str = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "").replace(/\u0000/g, "").trim().slice(0, max);

function num(v: unknown, max = 1e12) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

const date = (v: unknown) => {
  const s = str(v, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
};

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

/** Never trust the browser: rebuild the invoice from known fields only. */
export function sanitizeProforma(raw: unknown): Proforma {
  const r = obj(raw);
  const ex = obj(r.exporter);
  const co = obj(r.consignee);
  const bk = obj(r.bank);
  const items = (Array.isArray(r.items) ? r.items : []).slice(0, 50).map((it) => {
    const i = obj(it);
    return {
      description: str(i.description, 500),
      hsCode: str(i.hsCode, 16),
      qty: round2(num(i.qty, 1e9)),
      unit: str(i.unit, 12) || "PCS",
      rate: round2(num(i.rate)),
    };
  });
  const currency = str(r.currency, 3).toUpperCase();
  const incoterm = str(r.incoterm, 4).toUpperCase();

  return {
    invoiceNo: str(r.invoiceNo, 40),
    date: date(r.date),
    validUntil: date(r.validUntil),
    currency: CURRENCIES.includes(currency) ? currency : "USD",
    exporter: {
      name: str(ex.name, 255), address: str(ex.address, 600), phone: str(ex.phone, 40),
      email: str(ex.email, 255), gstin: str(ex.gstin, 30), iec: str(ex.iec, 30),
    },
    consignee: {
      name: str(co.name, 255), address: str(co.address, 600), country: str(co.country, 120),
      phone: str(co.phone, 40), email: str(co.email, 255),
    },
    buyerRef: str(r.buyerRef, 80),
    incoterm: INCOTERMS.includes(incoterm) ? incoterm : "FOB",
    portLoading: str(r.portLoading, 120),
    portDischarge: str(r.portDischarge, 120),
    countryOrigin: str(r.countryOrigin, 120),
    countryDestination: str(r.countryDestination, 120),
    paymentTerms: str(r.paymentTerms, 300),
    deliveryTime: str(r.deliveryTime, 200),
    items: items.length ? items : [emptyItem()],
    freight: round2(num(r.freight)),
    insurance: round2(num(r.insurance)),
    notes: str(r.notes, 1500),
    bank: {
      name: str(bk.name, 255), accountName: str(bk.accountName, 255), accountNo: str(bk.accountNo, 60),
      ifsc: str(bk.ifsc, 30), swift: str(bk.swift, 30),
    },
  };
}
