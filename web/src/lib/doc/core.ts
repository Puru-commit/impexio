// Pure helpers and types for every IMPEXIO document tool.
// No database or server-only code in here, so the browser can use it too.
import type { CompanyValues } from "@/lib/company";

export type Fields = Record<string, string>;
export type Row = Record<string, string>;
export type MasterKey = keyof CompanyValues;

/* ───────── what the user fills in ───────── */

export type Field = {
  k: string;
  label: string;
  kind?: "text" | "area" | "num" | "date" | "select";
  opts?: readonly string[];
  span?: 1 | 2 | 3 | 4;
  req?: boolean;
  ph?: string;
  /** Starting value: a master-profile field, "today", "ref", or plain text. */
  init?: { master: MasterKey } | "today" | "ref" | string;
};
export type Section = { title: string; note?: string; fields: Field[] };

export type TCol = {
  k: string;
  label: string;
  kind?: "text" | "num" | "date" | "select";
  opts?: readonly string[];
  span?: 1 | 2 | 3 | 4;
  ph?: string;
  init?: { master: MasterKey } | string;
};
export type Table = {
  title: string;
  note?: string;
  itemLabel: string;
  cols: TCol[];
  min: number;
  max: number;
  /** Rows with a fixed name (for example the four container types). */
  fixed?: string[];
  /** If set, each row gets an amount = qty x rate. */
  amount?: { qty: string; rate: string; cur?: string };
  /** Columns that are added up in the total row. */
  sum?: string[];
};

export type MCol = { k: string; label: string; group?: string };
export type MRow = {
  k: string;
  label: string;
  kind: "in" | "calc" | "head";
  fmt?: "n0" | "n2" | "n3" | "n6";
  init?: Record<string, string>;
  calc?: (g: (k: string) => number, f: (k: string) => number) => number | null;
  strong?: boolean;
};
export type Matrix = {
  title: string;
  note?: string;
  cols: MCol[];
  rows: MRow[];
  /** Let the user rename the column headings. */
  editHeads?: boolean;
};

/* ───────── what the paper shows ───────── */

export type Cell = string | { t: string; b?: boolean; span?: number; a?: "l" | "r" | "c"; bg?: "head" | "sub" | "total" };
export type Block =
  | { k: "kv"; title?: string; cols: number; cells: { l: string; v: string; span?: number }[] }
  | { k: "table"; title?: string; head: Cell[][]; rows: Cell[][]; w: number[]; a: ("l" | "r" | "c")[]; fs?: number }
  | { k: "text"; l: string; v: string }
  | { k: "words"; v: string }
  | { k: "para"; v: string; b?: boolean; gap?: number };

export type Co = {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  iec: string;
  pan: string;
  bankName: string;
  bankHolder: string;
  bankAccount: string;
  bankIfsc: string;
  bankSwift: string;
  preparedBy: string;
};
export const CO_KEYS = [
  "name", "address", "phone", "email", "website", "gstin", "iec", "pan",
  "bankName", "bankHolder", "bankAccount", "bankIfsc", "bankSwift", "preparedBy",
] as const;

export type DocData = {
  f: Fields;
  lines: Row[];
  m: Record<string, Record<string, string>>;
  heads: Record<string, string>;
  co: Co;
};

export type ToolDef = {
  slug: string;
  title: string;
  /** Big title on the paper. */
  heading: string;
  /** Prefix of the numbered reference, e.g. PI gives PI-2026-0001. */
  prefix: string;
  refLabel: string;
  dateLabel: string;
  kind: "doc" | "letter";
  /** Does finalising this use the free-document allowance? */
  counts: boolean;
  landscape?: boolean;
  showBank?: boolean;
  sections: Section[];
  table?: Table;
  matrix?: Matrix;
  after?: Section[];
  /** Live results shown while filling in. */
  results?: (d: DocData) => [string, string][];
  build: (d: DocData) => Block[];
  docTitle: (f: Fields) => string;
  /** Columns for the listing page. */
  listing: { label: string; get: (d: DocData) => string; right?: boolean }[];
  /** Number shown in the listing "Amount" summary, if any. */
  amountOf?: (d: DocData) => { value: number; cur: string } | null;
  /** Documents this one can be carried forward into. */
  next?: string[];
  /** Field renames when carrying forward: { targetKey: sourceKey } */
  from?: Record<string, Record<string, string>>;
  /** Letters only. */
  makeBody?: (f: Fields, co: Co) => string;
  letter?: { to: string[]; sign: string[] };
};

/* ───────── numbers, dates, words ───────── */

export const num = (v: unknown): number => {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const nf = new Map<string, Intl.NumberFormat>();
export function fmt(n: number, dp = 2, locale = "en-US") {
  const key = `${locale}${dp}`;
  let f = nf.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, { minimumFractionDigits: dp, maximumFractionDigits: dp });
    nf.set(key, f);
  }
  return f.format(Number.isFinite(n) ? n : 0);
}
export const qty = (n: number) => (n === 0 ? "" : fmt(n, Number.isInteger(n) ? 0 : 3));

export function fmtDate(iso?: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}
/** Today's date in India as yyyy-mm-dd (works on any server clock). */
export function todayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function below1000(n: number): string {
  const out: string[] = [];
  if (n >= 100) { out.push(`${ONES[Math.floor(n / 100)]} Hundred`); n %= 100; }
  if (n >= 20) { out.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "")); }
  else if (n > 0) out.push(ONES[n]);
  return out.join(" ");
}
function words(n: number, indian: boolean): string {
  if (n === 0) return "Zero";
  const parts: string[] = [];
  if (indian) {
    const units: [number, string][] = [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"]];
    for (const [v, name] of units) {
      if (n >= v) { parts.push(`${words(Math.floor(n / v), true)} ${name}`); n %= v; }
    }
  } else {
    const units: [number, string][] = [[1e9, "Billion"], [1e6, "Million"], [1e3, "Thousand"]];
    for (const [v, name] of units) {
      if (n >= v) { parts.push(`${words(Math.floor(n / v), false)} ${name}`); n %= v; }
    }
  }
  if (n > 0) parts.push(below1000(n));
  return parts.join(" ");
}
const CUR: Record<string, [string, string]> = {
  INR: ["Rupees", "Paise"], USD: ["US Dollars", "Cents"], EUR: ["Euros", "Cents"], GBP: ["Pounds Sterling", "Pence"],
  AED: ["UAE Dirhams", "Fils"], AUD: ["Australian Dollars", "Cents"], CAD: ["Canadian Dollars", "Cents"], SGD: ["Singapore Dollars", "Cents"],
};
export function amountInWords(amount: number, cur: string) {
  if (!(amount > 0)) return "";
  const whole = Math.floor(amount + 1e-9);
  const minor = Math.round((amount - whole) * 100);
  const [major, small] = CUR[cur] ?? [cur || "", "Cents"];
  const indian = cur === "INR";
  let s = `${major} ${words(whole, indian)}`.trim();
  if (minor > 0) s += ` and ${words(minor, false)} ${small}`;
  return `${s} Only`;
}

/* ───────── matrix maths ───────── */

export function computeMatrix(m: Matrix, d: DocData) {
  const rowBy = new Map(m.rows.map((r) => [r.k, r]));
  const f = (k: string) => num(d.f[k]);
  const out: Record<string, Record<string, number | null>> = {};
  for (const col of m.cols) {
    const cache: Record<string, number | null> = {};
    const busy = new Set<string>();
    const get = (k: string): number | null => {
      if (k in cache) return cache[k];
      const row = rowBy.get(k);
      if (!row || row.kind === "head") return 0;
      if (row.kind === "in") return (cache[k] = num(d.m[col.k]?.[k]));
      if (busy.has(k)) return 0;
      busy.add(k);
      const v = row.calc!((x) => get(x) ?? 0, f);
      busy.delete(k);
      return (cache[k] = v !== null && Number.isFinite(v) ? v : null);
    };
    for (const r of m.rows) if (r.kind !== "head") get(r.k);
    out[col.k] = cache;
  }
  return out;
}
export const div = (a: number, b: number) => (b ? a / b : null);
export const round = (n: number | null, dp: number) => (n === null ? null : Math.round(n * 10 ** dp) / 10 ** dp);
export function showCell(v: number | null | undefined, row: MRow) {
  if (v === null || v === undefined || (row.kind === "calc" && v === 0)) return "—";
  const dp = row.fmt === "n0" ? 0 : row.fmt === "n3" ? 3 : row.fmt === "n6" ? 6 : 2;
  return fmt(v, dp, "en-IN");
}

/* ───────── table maths ───────── */

export const rowAmount = (t: Table, r: Row) => (t.amount ? num(r[t.amount.qty]) * num(r[t.amount.rate]) : 0);
export const isUsed = (t: Table, r: Row) =>
  !!t.fixed || t.cols.some((c) => (c.k === t.cols[0].k || c.kind === "num") && (r[c.k] ?? "").trim() !== "");
export function tableTotals(t: Table, d: DocData) {
  const used = d.lines.filter((r) => isUsed(t, r));
  const sums: Record<string, number> = {};
  for (const k of t.sum ?? []) sums[k] = used.reduce((a, r) => a + num(r[k]), 0);
  const amount = used.reduce((a, r) => a + rowAmount(t, r), 0);
  const cur = t.amount?.cur ? used.find((r) => r[t.amount!.cur!])?.[t.amount.cur] ?? "" : "";
  return { used, sums, amount, cur };
}

/* ───────── readiness ───────── */

export function readiness(def: ToolDef, d: DocData) {
  const missing: { key: string; label: string }[] = [];
  let total = 0;
  for (const s of [...def.sections, ...(def.after ?? [])]) {
    for (const fl of s.fields) {
      if (!fl.req) continue;
      total++;
      if (!(d.f[fl.k] ?? "").trim()) missing.push({ key: fl.k, label: fl.label });
    }
  }
  if (def.table && def.table.min > 0 && !def.table.fixed) {
    total++;
    if (tableTotals(def.table, d).used.length < 1) missing.push({ key: "__table", label: `At least one ${def.table.itemLabel.toLowerCase()}` });
  }
  const done = total - missing.length;
  return { missing, percent: total ? Math.round((done / total) * 100) : 100, ready: missing.length === 0 };
}

/* ───────── create / clean / carry forward ───────── */

const emptyCo = (): Co => Object.fromEntries(CO_KEYS.map((k) => [k, ""])) as Co;

export function coFrom(c: CompanyValues): Co {
  return {
    name: c.companyName,
    address: [c.address, [c.city, c.state].filter(Boolean).join(", "), [c.country, c.pincode].filter(Boolean).join(" ")].filter(Boolean).join(", "),
    phone: c.phone, email: c.email, website: c.website, gstin: c.gstin, iec: c.iecCode, pan: c.pan,
    bankName: c.bankName, bankHolder: c.bankAccountName, bankAccount: c.bankAccountNo, bankIfsc: c.bankIfsc, bankSwift: c.bankSwift,
    preparedBy: c.preparedBy,
  };
}

function initValue(init: Field["init"], master: CompanyValues, ctx: { today: string; ref: string }) {
  if (!init) return "";
  if (typeof init === "object") return master[init.master] ?? "";
  if (init === "today") return ctx.today;
  if (init === "ref") return ctx.ref;
  return init;
}

export function blankLine(def: ToolDef, master: CompanyValues, fixedName?: string): Row {
  const t = def.table!;
  const r: Row = {};
  t.cols.forEach((c, i) => {
    r[c.k] = i === 0 && fixedName !== undefined ? fixedName : typeof c.init === "object" ? master[c.init.master] ?? "" : c.init ?? "";
  });
  return r;
}

export function newData(def: ToolDef, master: CompanyValues, ctx: { today: string; ref: string }): DocData {
  const f: Fields = {};
  for (const s of [...def.sections, ...(def.after ?? [])]) for (const fl of s.fields) f[fl.k] = initValue(fl.init, master, ctx);
  if (def.makeBody) f.body = "";
  const lines: Row[] = [];
  if (def.table) {
    if (def.table.fixed) def.table.fixed.forEach((n) => lines.push(blankLine(def, master, n)));
    else for (let i = 0; i < def.table.min; i++) lines.push(blankLine(def, master));
  }
  const m: DocData["m"] = {};
  const heads: DocData["heads"] = {};
  if (def.matrix) {
    for (const c of def.matrix.cols) {
      m[c.k] = {};
      heads[c.k] = c.label;
      for (const r of def.matrix.rows) if (r.kind === "in") m[c.k][r.k] = r.init?.[c.k] ?? r.init?.["*"] ?? "";
    }
  }
  return { f, lines, m, heads, co: coFrom(master) };
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : typeof v === "number" ? String(v).slice(0, max) : "");
const numStr = (v: unknown) => {
  const s = str(v, 24).replace(/[^0-9.\-,]/g, "");
  return s;
};

/** Rebuild the data from whatever the browser sent, keeping only known keys. */
export function sanitize(def: ToolDef, raw: unknown): DocData {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rf = (r.f && typeof r.f === "object" ? r.f : {}) as Record<string, unknown>;
  const f: Fields = {};
  for (const s of [...def.sections, ...(def.after ?? [])]) {
    for (const fl of s.fields) {
      const v = rf[fl.k];
      f[fl.k] = fl.kind === "num" ? numStr(v) : fl.kind === "date" ? (/^\d{4}-\d{2}-\d{2}$/.test(str(v, 10)) ? str(v, 10) : "") : str(v, fl.kind === "area" ? 3000 : 300);
    }
  }
  if (def.makeBody) f.body = str(rf.body, 6000);

  const lines: Row[] = [];
  if (def.table) {
    const t = def.table;
    const rl = Array.isArray(r.lines) ? r.lines.slice(0, t.max) : [];
    for (let i = 0; i < (t.fixed ? t.fixed.length : rl.length); i++) {
      const src = (rl[i] && typeof rl[i] === "object" ? rl[i] : {}) as Record<string, unknown>;
      const row: Row = {};
      t.cols.forEach((c, ci) => {
        row[c.k] = t.fixed && ci === 0 ? t.fixed[i] : c.kind === "num" ? numStr(src[c.k]) : c.kind === "date" ? (/^\d{4}-\d{2}-\d{2}$/.test(str(src[c.k], 10)) ? str(src[c.k], 10) : "") : str(src[c.k], 400);
      });
      lines.push(row);
    }
  }
  const m: DocData["m"] = {};
  const heads: DocData["heads"] = {};
  if (def.matrix) {
    const rm = (r.m && typeof r.m === "object" ? r.m : {}) as Record<string, Record<string, unknown>>;
    const rh = (r.heads && typeof r.heads === "object" ? r.heads : {}) as Record<string, unknown>;
    for (const c of def.matrix.cols) {
      m[c.k] = {};
      for (const row of def.matrix.rows) if (row.kind === "in") m[c.k][row.k] = numStr(rm[c.k]?.[row.k]);
      heads[c.k] = def.matrix.editHeads ? str(rh[c.k], 60) || c.label : c.label;
    }
  }
  const co = emptyCo();
  const rc = (r.co && typeof r.co === "object" ? r.co : {}) as Record<string, unknown>;
  for (const k of CO_KEYS) co[k] = str(rc[k], 500);
  return { f, lines, m, heads, co };
}

/** Pad a saved document so the form always has the right number of rows. */
export function padData(def: ToolDef, d: DocData, master: CompanyValues): DocData {
  if (!def.table || def.table.fixed) return d;
  const lines = d.lines.slice();
  while (lines.length < def.table.min) lines.push(blankLine(def, master));
  return { ...d, lines };
}

/** Copy what both documents have in common into a fresh draft of another type. */
export function carryForward(src: ToolDef, d: DocData, tgt: ToolDef, master: CompanyValues, ctx: { today: string; ref: string }): DocData {
  const out = newData(tgt, master, ctx);
  const map = tgt.from?.[src.slug] ?? {};
  for (const k of Object.keys(out.f)) {
    if (k === "ref" || k === "date" || k === "body") continue;
    const from = map[k] ?? k;
    if (d.f[from]?.trim()) out.f[k] = d.f[from];
  }
  if (tgt.table && src.table && !tgt.table.fixed && !src.table.fixed) {
    const used = d.lines.filter((r) => isUsed(src.table!, r)).slice(0, tgt.table.max);
    if (used.length) {
      out.lines = used.map((r) => {
        const row = blankLine(tgt, master);
        for (const c of tgt.table!.cols) if (r[c.k]?.trim()) row[c.k] = r[c.k];
        return row;
      });
      while (out.lines.length < tgt.table.min) out.lines.push(blankLine(tgt, master));
    }
  }
  out.co = d.co;
  return out;
}

/* ───────── the paper (shared by screen preview and PDF) ───────── */

export type View = {
  heading: string;
  landscape: boolean;
  co: Co;
  meta: [string, string][];
  strip: [string, string][];
  blocks: Block[];
  bank: [string, string][] | null;
  letter: boolean;
};

export function buildView(def: ToolDef, d: DocData): View {
  const strip: [string, string][] = [["Company", d.co.name]];
  if (d.f.branch) strip.push(["Branch", d.f.branch]);
  if (d.f.location) strip.push(["Location", d.f.location]);
  if (d.f.dayBook) strip.push(["Day book", d.f.dayBook]);
  const bank: [string, string][] = [
    ["Bank", d.co.bankName], ["Account name", d.co.bankHolder], ["Account no.", d.co.bankAccount], ["IFSC", d.co.bankIfsc], ["SWIFT", d.co.bankSwift],
  ];
  const bankShown = def.showBank ? bank.filter(([, v]) => v) : [];
  return {
    heading: def.heading,
    landscape: !!def.landscape,
    co: d.co,
    meta: [[def.refLabel, d.f.ref ?? ""], [def.dateLabel, fmtDate(d.f.date)]],
    strip: def.kind === "doc" ? strip.filter(([, v]) => v) : [],
    blocks: def.build(d),
    bank: bankShown.length ? bankShown : null,
    letter: def.kind === "letter",
  };
}

/* shared builders used by tool definitions */

export const kv = (cells: [string, string, number?][], cols = 4, title?: string): Block => ({
  k: "kv", cols, title, cells: cells.map(([l, v, span]) => ({ l, v, span })),
});

export function linesBlock(def: ToolDef, d: DocData, cols: { k: string; label: string; a?: "l" | "r" | "c"; w: number; show?: (v: string, r: Row) => string }[], opts: { sn?: boolean; title?: string; fs?: number } = {}): Block[] {
  const t = def.table!;
  const { used, sums, amount, cur } = tableTotals(t, d);
  const head: Cell[] = [...(opts.sn ? ["S.No."] : []), ...cols.map((c) => c.label), ...(t.amount ? [{ t: `Amount${cur ? ` (${cur})` : ""}`, a: "r" as const }] : [])];
  const a: ("l" | "r" | "c")[] = [...(opts.sn ? (["c"] as const) : []), ...cols.map((c) => c.a ?? "l"), ...(t.amount ? (["r"] as const) : [])];
  const w = [...(opts.sn ? [4] : []), ...cols.map((c) => c.w), ...(t.amount ? [12] : [])];
  const rows: Cell[][] = used.map((r, i) => [
    ...(opts.sn ? [String(i + 1)] : []),
    ...cols.map((c) => {
      const v = r[c.k] ?? "";
      return c.show ? c.show(v, r) : v;
    }),
    ...(t.amount ? [fmt(rowAmount(t, r))] : []),
  ]);
  if (t.amount || t.sum?.length) {
    rows.push([
      ...(opts.sn ? [""] : []),
      ...cols.map((c, i) => (i === 0 ? { t: "TOTAL", b: true, bg: "total" as const } : t.sum?.includes(c.k) ? { t: qty(sums[c.k] ?? 0), b: true, bg: "total" as const } : { t: "", bg: "total" as const })),
      ...(t.amount ? [{ t: fmt(amount), b: true, bg: "total" as const }] : []),
    ]);
  }
  const out: Block[] = [{ k: "table", title: opts.title, head: [head], rows, w, a, fs: opts.fs }];
  if (t.amount && cur) out.push({ k: "words", v: amountInWords(amount, cur) });
  return out;
}

export function matrixBlock(def: ToolDef, d: DocData): Block {
  const mx = def.matrix!;
  const res = computeMatrix(mx, d);
  const hasGroup = mx.cols.some((c) => c.group);
  const head: Cell[][] = [];
  if (hasGroup) {
    const row: Cell[] = [{ t: "PARTICULARS", bg: "head" }];
    let i = 0;
    while (i < mx.cols.length) {
      const g = mx.cols[i].group ?? "";
      let n = 1;
      while (i + n < mx.cols.length && mx.cols[i + n].group === g) n++;
      row.push({ t: g, span: n, a: "c", bg: "head" });
      i += n;
    }
    head.push(row);
    head.push([{ t: "", bg: "head" }, ...mx.cols.map((c) => ({ t: d.heads[c.k] || c.label, a: "c" as const, bg: "head" as const }))]);
  } else {
    head.push([{ t: "PARTICULARS", bg: "head" }, ...mx.cols.map((c) => ({ t: d.heads[c.k] || c.label, a: "c" as const, bg: "head" as const }))]);
  }
  const rows: Cell[][] = mx.rows
    .map((r) =>
      r.kind === "head"
        ? [{ t: r.label, b: true, span: mx.cols.length + 1, bg: "sub" as const }]
        : [{ t: r.label, b: r.strong, bg: r.strong ? ("total" as const) : undefined }, ...mx.cols.map((c) => {
            const raw = res[c.k][r.k];
            const text = r.kind === "in" && !(d.m[c.k]?.[r.k] ?? "").trim() ? "" : showCell(raw, r);
            return { t: text, a: "r" as const, b: r.strong, bg: r.strong ? ("total" as const) : undefined };
          })],
    );
  const first = 30;
  const rest = Math.floor((100 - first) / mx.cols.length);
  return { k: "table", head, rows, w: [first, ...mx.cols.map(() => rest)], a: ["l", ...mx.cols.map(() => "r" as const)], fs: mx.cols.length > 5 ? 7 : 8.5 };
}
