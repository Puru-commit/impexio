// The 12 IMPEXIO tools. The layouts follow the IMPEXIO_DOCUMENT Excel file, sheet by sheet.
import {
  div, fmt, fmtDate, kv, linesBlock, matrixBlock, num, qty, round, tableTotals,
  type Block, type DocData, type Field, type Fields, type MRow, type Section, type ToolDef,
} from "@/lib/doc/core";

const INCOTERMS = ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] as const;
const CURRENCIES = ["USD", "EUR", "GBP", "AED", "INR", "AUD", "CAD", "SGD"] as const;
const UNITS = ["KGS", "MT", "PCS", "BAGS", "BOXES", "CTNS", "SETS", "LTR", "MTR", "PAIRS"] as const;
const YES_NO = ["Allowed", "Not allowed"] as const;

const first = (v: string | undefined, n = 48) => ((v ?? "").split("\n")[0] ?? "").trim().slice(0, n);

/** The "Document details" box that sits at the top of every tool (company, branch, location, day book come from the master profile). */
const head = (refLabel: string, dateLabel: string, extra: Field[] = []): Section => ({
  title: "Document details",
  note: "Branch, location and day book come from your master profile. Change them here only for this document.",
  fields: [
    { k: "ref", label: refLabel, init: "ref", req: true },
    { k: "date", label: dateLabel, kind: "date", init: "today", req: true },
    { k: "branch", label: "Branch", init: { master: "branch" } },
    { k: "location", label: "Location", init: { master: "location" } },
    { k: "dayBook", label: "Day book", init: { master: "dayBook" } },
    ...extra,
  ],
});

const remarks = (label = "Remarks"): Section => ({
  title: label,
  fields: [{ k: "remarks", label, kind: "area", span: 4, ph: "Anything extra you want printed on the document" }],
});

const amountOf = (def: () => ToolDef) => (d: DocData) => {
  const t = def().table!;
  const { amount, cur } = tableTotals(t, d);
  return amount > 0 ? { value: amount, cur: cur || "" } : null;
};

/* ═════════════ 01  CBM CALCULATION ═════════════ */

const cbmCalc = (f: Fields) => {
  const perCbm = (num(f.cmL) * num(f.cmW) * num(f.cmH)) / 1_000_000;
  const perCft = (num(f.inL) * num(f.inW) * num(f.inH)) / 1728;
  const boxes = num(f.boxes);
  return { perCbm, perCft, boxes, totalCbm: perCbm * (boxes || 1), totalCft: perCft * (boxes || 1) };
};

const cbm: ToolDef = {
  slug: "cbm-calculation", title: "CBM Calculation", heading: "CBM CALCULATION REPORT", prefix: "CBM",
  refLabel: "CBM No.", dateLabel: "CBM Date", kind: "doc", counts: false,
  sections: [head("CBM No.", "CBM date")],
  table: {
    title: "Container detail", itemLabel: "Container", min: 4, max: 4,
    fixed: ["20' CONTAINER", "40' GP CONTAINER", "40' HQ CONTAINER", "LCL SHIPMENT"],
    cols: [
      { k: "name", label: "Container type" },
      { k: "cbm", label: "CBM", kind: "num", ph: "0" },
      { k: "mt", label: "MT", kind: "num", ph: "0" },
      { k: "qty", label: "Product quantity", kind: "num", ph: "0" },
    ],
    sum: ["cbm", "mt", "qty"],
  },
  after: [
    {
      title: "CBM calculation (centimetres)", note: "CBM = Length x Width x Height / 1,000,000",
      fields: [
        { k: "cmL", label: "Length (cm)", kind: "num" }, { k: "cmW", label: "Width (cm)", kind: "num" },
        { k: "cmH", label: "Height (cm)", kind: "num" }, { k: "boxes", label: "Total boxes", kind: "num" },
      ],
    },
    {
      title: "CFT calculation (inches)", note: "CFT = Length x Width x Height / 1,728",
      fields: [
        { k: "inL", label: "Length (inch)", kind: "num" }, { k: "inW", label: "Width (inch)", kind: "num" },
        { k: "inH", label: "Height (inch)", kind: "num" },
      ],
    },
    remarks(),
  ],
  results: (d) => {
    const c = cbmCalc(d.f);
    return [
      ["CBM per box", c.perCbm ? fmt(c.perCbm, 4) : "—"], ["Total CBM", c.perCbm ? fmt(c.totalCbm, 4) : "—"],
      ["CFT per box", c.perCft ? fmt(c.perCft, 4) : "—"], ["Total CFT", c.perCft ? fmt(c.totalCft, 4) : "—"],
    ];
  },
  docTitle: (f) => `CBM ${f.ref ?? ""}`.trim(),
  listing: [
    { label: "Total CBM", get: (d) => { const c = cbmCalc(d.f); return c.perCbm ? fmt(c.totalCbm, 3) : "—"; }, right: true },
    { label: "Boxes", get: (d) => d.f.boxes || "—", right: true },
  ],
  build: (d) => {
    const c = cbmCalc(d.f);
    const blocks: Block[] = [...linesBlock(cbm, d, [
      { k: "name", label: "Container type", w: 40 },
      { k: "cbm", label: "CBM", a: "r", w: 20, show: (v) => (v ? fmt(num(v), 2) : "") },
      { k: "mt", label: "MT", a: "r", w: 20, show: (v) => (v ? fmt(num(v), 2) : "") },
      { k: "qty", label: "Product quantity", a: "r", w: 20, show: (v) => (v ? fmt(num(v), 0) : "") },
    ], { title: "Container detail" })];
    blocks.push(kv([
      ["Length (cm)", d.f.cmL ?? ""], ["Width (cm)", d.f.cmW ?? ""], ["Height (cm)", d.f.cmH ?? ""], ["CBM per box", c.perCbm ? fmt(c.perCbm, 4) : ""],
      ["Total boxes", d.f.boxes ?? ""], ["Total CBM", c.perCbm ? fmt(c.totalCbm, 4) : ""],
    ], 4, "CBM calculation (1 inch = 2.54 cm)"));
    blocks.push(kv([
      ["Length (inch)", d.f.inL ?? ""], ["Width (inch)", d.f.inW ?? ""], ["Height (inch)", d.f.inH ?? ""], ["CFT per box", c.perCft ? fmt(c.perCft, 4) : ""],
      ["Total boxes", d.f.boxes ?? ""], ["Total CFT", c.perCft ? fmt(c.totalCft, 4) : ""],
    ], 4, "CFT calculation"));
    if (d.f.remarks) blocks.push({ k: "text", l: "Remarks", v: d.f.remarks });
    blocks.push(kv([
      ["1 CBM", "35.3147 CFT"], ["1 CFT", "0.0283 CBM"], ["1 inch", "2.54 cm"], ["1 cm", "0.3937 inch"],
      ["20' container", "about 25 CBM"], ["40' GP container", "about 60 CBM"], ["40' HQ container", "about 76 CBM"],
    ], 4, "Conversion reference"));
    return blocks;
  },
};

/* ═════════════ 02  CONTAINER EXPENSES FOB ═════════════ */

const FOB_ROWS: [string, string, string[]][] = [
  ["thc", "THC & Docs", ["18000", "26000", "32000", "950"]],
  ["bl", "B/L", ["3000", "3000", "3000", "200"]],
  ["sb", "Shipping Bill", ["2000", "2000", "2000", "150"]],
  ["edi", "EDI", ["150", "150", "150", "50"]],
  ["agency", "Agency", ["4000", "5000", "6000", "300"]],
  ["wheel", "On Wheel", ["3000", "3000", "3500", "250"]],
  ["customs", "Customs Expense", ["2000", "2000", "2500", "150"]],
  ["coo", "Certificate of Origin (if needed)", ["1000", "1000", "1000", "100"]],
  ["transport", "Transportation to port", ["10000", "10000", "12000", "500"]],
  ["insurance", "Insurance at actual", ["2500", "2500", "3000", "200"]],
  ["firstExp", "First time export registration", ["5000", "5000", "5000", ""]],
  ["fumig", "Fumigation charges", ["", "", "2000", "150"]],
  ["seal", "Seal charges", ["200", "200", "200", "50"]],
  ["weigh", "Weighment charges", ["", "500", "500", "100"]],
  ["misc", "Miscellaneous", ["500", "500", "750", "100"]],
];
const FOB_COLS = ["c20", "c40", "c40hq", "lcl"];
const fobRows: MRow[] = [
  { k: "h", label: "DOCS & STUFFING — CHARGES IN INR", kind: "head" },
  ...FOB_ROWS.map(([k, label, vals]): MRow => ({ k, label, kind: "in", fmt: "n0", init: Object.fromEntries(FOB_COLS.map((c, i) => [c, vals[i]])) })),
  { k: "total", label: "TOTAL EXPENSES", kind: "calc", fmt: "n0", strong: true, calc: (g) => FOB_ROWS.reduce((a, [k]) => a + g(k), 0) },
  { k: "cbm", label: "CBM", kind: "in", fmt: "n0", init: { c20: "27", c40: "65", c40hq: "76", lcl: "1" } },
  { k: "perCbm", label: "PER CBM COST", kind: "calc", fmt: "n0", strong: true, calc: (g) => round(div(g("total"), g("cbm")), 0) },
];

const fob: ToolDef = {
  slug: "container-expenses-fob", title: "Container Expenses FOB", heading: "CONTAINER EXPENSES FOB", prefix: "FOB",
  refLabel: "FOB Ref No.", dateLabel: "FOB Date", kind: "doc", counts: false,
  sections: [head("FOB ref no.", "FOB date", [{ k: "portLoading", label: "Port of loading", init: { master: "defaultPortLoading" }, req: true }])],
  matrix: {
    title: "Charges in INR", note: "The standard rates are filled in for you. Change any number to match your quote.",
    cols: [{ k: "c20", label: "20' Container" }, { k: "c40", label: "40' GP Container" }, { k: "c40hq", label: "40' HQ Container" }, { k: "lcl", label: "LCL / Per CBM" }],
    rows: fobRows,
  },
  after: [remarks()],
  docTitle: (f) => `FOB ${f.ref ?? ""}${f.portLoading ? ` · ${first(f.portLoading)}` : ""}`.trim(),
  listing: [
    { label: "Port", get: (d) => d.f.portLoading || "—" },
    { label: "20' total (INR)", get: (d) => fmt(Number(d.m.c20 && Object.entries(d.m.c20).filter(([k]) => FOB_ROWS.some(([r]) => r === k)).reduce((a, [, v]) => a + num(v), 0)), 0, "en-IN"), right: true },
  ],
  build: (d) => {
    const b: Block[] = [kv([["Port of loading", d.f.portLoading ?? "", 2]], 4), matrixBlock(fob, d)];
    if (d.f.remarks) b.push({ k: "text", l: "Remarks", v: d.f.remarks });
    return b;
  },
};

/* ═════════════ 03  EXPORT COSTING ═════════════ */

const C8 = [
  ["c20", "20' CONTAINER"], ["c40", "40' GP CONTAINER"], ["c40hq", "40' HQ CONTAINER"], ["lcl", "LCL SHIPMENT"],
].flatMap(([k, g]) => [
  { k: `${k}f`, label: "FCL costing", group: g },
  { k: `${k}l`, label: "LCL costing", group: g },
]);
const costingRows: MRow[] = [
  { k: "kgs", label: "Maximum loading (KGS)", kind: "in", fmt: "n0" },
  { k: "cbm", label: "Maximum CBM loading", kind: "in", fmt: "n2" },
  { k: "h1", label: "COST BUILD-UP (INR)", kind: "head" },
  { k: "rate", label: "Our basic rate (INR per KG)", kind: "in", fmt: "n2" },
  { k: "basic", label: "Basic cost", kind: "calc", calc: (g) => g("rate") * g("kgs") },
  { k: "transport", label: "Transportation cost (local)", kind: "in", fmt: "n0" },
  { k: "dins", label: "Domestic insurance", kind: "in", fmt: "n0" },
  { k: "cha", label: "CHA + agency + CFS + THC", kind: "in", fmt: "n0" },
  { k: "other", label: "Other expenses (direct & indirect)", kind: "in", fmt: "n0" },
  { k: "sub", label: "Cost before profit", kind: "calc", calc: (g) => g("basic") + g("transport") + g("dins") + g("cha") + g("other") },
  { k: "profitPct", label: "Profit %", kind: "in", fmt: "n2" },
  { k: "profit", label: "Profit", kind: "calc", calc: (g) => (g("sub") * g("profitPct")) / 100 },
  { k: "gstPct", label: "GST %", kind: "in", fmt: "n2" },
  { k: "gst", label: "GST", kind: "calc", calc: (g) => ((g("sub") + g("profit")) * g("gstPct")) / 100 },
  { k: "fob", label: "FOB VALUE IN INR", kind: "calc", strong: true, calc: (g) => g("sub") + g("profit") + g("gst") },
  { k: "fobKg", label: "FOB value per KG (INR)", kind: "calc", calc: (g) => div(g("fob"), g("kgs")) },
  { k: "fobUsd", label: "FOB VALUE IN $", kind: "calc", strong: true, calc: (g, f) => round(div(g("fob"), f("fx")), 2) },
  { k: "fobMt", label: "FOB value per 1 MT (INR)", kind: "calc", calc: (g) => round(div(g("fob"), g("kgs") / 1000), 2) },
  { k: "h2", label: "SEA FREIGHT & CIF", kind: "head" },
  { k: "marine", label: "Marine insurance (0.1% of FOB)", kind: "calc", calc: (g) => round(g("fob") * 0.001, 2) },
  { k: "sea", label: "Sea freight charges (INR)", kind: "in", fmt: "n0" },
  { k: "cif", label: "CIF VALUE IN INR", kind: "calc", strong: true, calc: (g) => g("fob") + g("marine") + g("sea") },
  { k: "cifUsd", label: "CIF VALUE IN $", kind: "calc", strong: true, calc: (g, f) => round(div(g("cif"), f("fx")), 2) },
  { k: "cifMt", label: "CIF value per 1 MT (INR)", kind: "calc", calc: (g) => round(div(g("cif"), g("kgs") / 1000), 2) },
  { k: "h3", label: "PACKING DETAILS", kind: "head" },
  { k: "bags", label: "No. of bags / units", kind: "in", fmt: "n0" },
  { k: "net", label: "Net weight per bag / unit (KGS)", kind: "in", fmt: "n3" },
  { k: "gross", label: "Gross weight per bag / unit (KGS)", kind: "in", fmt: "n3" },
  { k: "bagPrice", label: "Selling price per bag (INR)", kind: "calc", calc: (g) => round(g("fobKg") * g("net"), 2) },
];

const costing: ToolDef = {
  slug: "export-costing", title: "Export Costing", heading: "EXPORT COSTING — COST SHEET", prefix: "EC",
  refLabel: "Costing Ref", dateLabel: "Rates as on", kind: "doc", counts: false, landscape: true,
  sections: [
    head("Costing ref", "Rates as on"),
    {
      title: "Rates and product",
      fields: [
        { k: "fx", label: "Currency rate: 1 $ = INR", kind: "num", req: true, ph: "e.g. 83.50" },
        { k: "shipRate", label: "Ship rate ($)", kind: "num" },
        { k: "portLoading", label: "Port of loading", init: { master: "defaultPortLoading" } },
        { k: "product", label: "Product description", span: 4, req: true },
      ],
    },
  ],
  matrix: {
    title: "Costing sheet (INR)", note: "Fill the boxes in white. Grey rows are worked out for you.",
    cols: C8, rows: costingRows,
  },
  after: [remarks()],
  docTitle: (f) => `Costing ${f.ref ?? ""}${f.product ? ` · ${first(f.product, 30)}` : ""}`.trim(),
  listing: [
    { label: "Product", get: (d) => first(d.f.product, 30) || "—" },
    { label: "Port", get: (d) => d.f.portLoading || "—" },
    { label: "Rate 1$", get: (d) => d.f.fx || "—", right: true },
  ],
  build: (d) => {
    const b: Block[] = [kv([
      ["Rates as on", fmtDate(d.f.date)], ["Currency rate 1 $ = INR", d.f.fx ?? ""], ["Ship rate $", d.f.shipRate ?? ""], ["Port of loading", d.f.portLoading ?? ""],
      ["Product description", d.f.product ?? "", 4],
    ], 4), matrixBlock(costing, d)];
    if (d.f.remarks) b.push({ k: "text", l: "Remarks", v: d.f.remarks });
    return b;
  },
};

/* ═════════════ 04  EXPORT COSTING 2 ═════════════ */

const costing2Rows: MRow[] = [
  { k: "net", label: "MOQ net weight (KGS)", kind: "in", fmt: "n0" },
  { k: "gross", label: "MOQ gross weight (KGS)", kind: "in", fmt: "n0" },
  { k: "cartons", label: "No. of cartons", kind: "in", fmt: "n0" },
  { k: "cbmCtn", label: "CBM per carton", kind: "in", fmt: "n3" },
  { k: "cbm", label: "TOTAL CBM", kind: "calc", fmt: "n3", strong: true, calc: (g) => g("cartons") * g("cbmCtn") },
  { k: "exw", label: "Our EXW rate (INR per KG)", kind: "in", fmt: "n2" },
  { k: "goods", label: "Goods value (EXW rate x net KGS)", kind: "calc", calc: (g) => g("exw") * g("net") },
  { k: "h1", label: "LOCAL TRANSPORTATION COST", kind: "head" },
  { k: "freight", label: "Freight", kind: "in", fmt: "n0" },
  { k: "docket", label: "Docket & FOV", kind: "in", fmt: "n0" },
  { k: "fsc", label: "FSC", kind: "in", fmt: "n2" },
  { k: "special", label: "Special delivery charge", kind: "in", fmt: "n0" },
  { k: "tax1", label: "Service tax on the above", kind: "calc", calc: (g, f) => ((g("freight") + g("docket") + g("fsc") + g("special")) * f("taxPct")) / 100 },
  { k: "dins", label: "Domestic insurance", kind: "in", fmt: "n0" },
  { k: "trTotal", label: "TOTAL", kind: "calc", strong: true, calc: (g) => g("freight") + g("docket") + g("fsc") + g("special") + g("tax1") + g("dins") },
  { k: "h2", label: "CUSTOM CLEARANCE & HANDLING CHARGES", kind: "head" },
  { k: "thc", label: "General THC", kind: "in", fmt: "n2" },
  { k: "bl", label: "B/L charges", kind: "in", fmt: "n0" },
  { k: "coo", label: "Certificate of origin", kind: "in", fmt: "n0" },
  { k: "ens", label: "Entry Summary Declaration — ENS (USD 25)", kind: "in", fmt: "n0" },
  { k: "vgm", label: "Verified Gross Mass — VGM (USD 20)", kind: "in", fmt: "n0" },
  { k: "cfs", label: "Custom clearance charge — CFS", kind: "in", fmt: "n0" },
  { k: "tax2", label: "Service tax on the above", kind: "calc", calc: (g, f) => ((g("thc") + g("bl") + g("coo") + g("ens") + g("vgm") + g("cfs")) * f("taxPct")) / 100 },
  { k: "cuTotal", label: "TOTAL", kind: "calc", strong: true, calc: (g) => g("thc") + g("bl") + g("coo") + g("ens") + g("vgm") + g("cfs") + g("tax2") },
  { k: "other", label: "OTHER EXPENSES (direct & indirect)", kind: "in", fmt: "n0" },
  { k: "fob", label: "FOB VALUE IN INR", kind: "calc", strong: true, calc: (g) => g("goods") + g("trTotal") + g("cuTotal") + g("other") },
  { k: "fobKg", label: "FOB value per KG", kind: "calc", fmt: "n6", calc: (g) => round(div(g("fob"), g("net")), 6) },
  { k: "fobUsd", label: "FOB VALUE IN $", kind: "calc", strong: true, calc: (g, f) => round(div(g("fob"), f("fx")), 2) },
  { k: "marine", label: "Marine insurance (0.1% of FOB)", kind: "calc", calc: (g) => round(g("fob") * 0.001, 2) },
  { k: "sea", label: "Sea freight charges (INR)", kind: "in", fmt: "n0" },
  { k: "cif", label: "CIF VALUE IN INR", kind: "calc", strong: true, calc: (g) => g("fob") + g("marine") + g("sea") },
  { k: "cifUsd", label: "CIF VALUE IN $", kind: "calc", strong: true, calc: (g, f) => round(div(g("cif"), f("fx")), 2) },
];

const costing2: ToolDef = {
  slug: "export-costing-2", title: "Export Costing 2", heading: "EXPORT COSTING 2 — COSTING SHEET", prefix: "EC2",
  refLabel: "Costing Ref", dateLabel: "Rate on date", kind: "doc", counts: false,
  sections: [
    head("Costing ref", "Rate on date"),
    {
      title: "Rate and product",
      fields: [
        { k: "fx", label: "Currency rate: 1 $ = INR", kind: "num", req: true, ph: "e.g. 83.50" },
        { k: "taxPct", label: "Service tax %", kind: "num", init: "18" },
        { k: "product", label: "Product / description", span: 2, req: true },
      ],
    },
  ],
  matrix: {
    title: "Costing sheet (INR)", note: "Three shipment sizes side by side. You can rename the column headings.", editHeads: true,
    cols: [{ k: "a", label: "LCL shipment · 1" }, { k: "b", label: "LCL shipment · 2" }, { k: "c", label: "40' HQ container · FCL" }],
    rows: costing2Rows,
  },
  after: [remarks()],
  docTitle: (f) => `Costing 2 ${f.ref ?? ""}${f.product ? ` · ${first(f.product, 30)}` : ""}`.trim(),
  listing: [
    { label: "Product", get: (d) => first(d.f.product, 30) || "—" },
    { label: "Rate 1$", get: (d) => d.f.fx || "—", right: true },
  ],
  build: (d) => {
    const b: Block[] = [kv([["Rate on date", fmtDate(d.f.date)], ["Currency rate 1 $ = INR", d.f.fx ?? ""], ["Service tax %", d.f.taxPct ?? ""], ["Product", d.f.product ?? ""]], 4), matrixBlock(costing2, d)];
    if (d.f.remarks) b.push({ k: "text", l: "Remarks", v: d.f.remarks });
    return b;
  },
};

/* ═════════════ 05  EXPORT DATA FILTER ═════════════ */

const filter: ToolDef = {
  slug: "export-data-filter-format", title: "Export Data Filter Format", heading: "EXPORT DATA FILTER", prefix: "EDF",
  refLabel: "Sheet No.", dateLabel: "Date", kind: "doc", counts: false, landscape: true,
  sections: [head("Sheet no.", "Date", [{ k: "client", label: "Client / list name" }])],
  table: {
    title: "Buyers", itemLabel: "Buyer", min: 10, max: 60, note: "I = Importer, R = Regular buyer, M = Manufacturer  |  B = Big, M = Medium, S = Small",
    cols: [
      { k: "buyer", label: "Buyer name", span: 2 },
      { k: "contact", label: "Contact person", span: 2 },
      { k: "email", label: "Email ID", span: 2 },
      { k: "phone", label: "Contact number" },
      { k: "country", label: "Country" },
      { k: "website", label: "Website", span: 2 },
      { k: "kind", label: "I / R / M", kind: "select", opts: ["", "I", "R", "M"] },
      { k: "size", label: "B / M / S", kind: "select", opts: ["", "B", "M", "S"] },
      { k: "intro", label: "Intro mail date", kind: "date" },
      { k: "follow", label: "Follow-up mail date", kind: "date" },
      { k: "personal", label: "Personalised mail date", kind: "date" },
      { k: "callTime", label: "Suitable time for calling", ph: "2:00 PM – 4:00 PM" },
      { k: "skype", label: "Skype calling" },
      { k: "remarks", label: "Remarks", span: 2 },
    ],
  },
  results: (d) => {
    const used = d.lines.filter((r) => r.buyer?.trim());
    return [["Buyers listed", String(used.length)], ["Countries", String(new Set(used.map((r) => r.country?.trim().toLowerCase()).filter(Boolean)).size)]];
  },
  docTitle: (f) => `Buyer list ${f.ref ?? ""}${f.client ? ` · ${first(f.client, 30)}` : ""}`.trim(),
  listing: [
    { label: "Buyers", get: (d) => String(d.lines.filter((r) => r.buyer?.trim()).length), right: true },
    { label: "Client", get: (d) => d.f.client || "—" },
  ],
  build: (d) => {
    const used = d.lines.filter((r) => r.buyer?.trim());
    const D = (v: string) => fmtDate(v);
    const rows = used.map((r, i) => [String(i + 1), r.buyer, r.contact, r.email, r.phone, r.country, r.website, r.kind, r.size, D(r.intro), D(r.follow), D(r.personal), r.callTime, r.skype, r.remarks]);
    return [
      { k: "para", v: "I = Importer   R = Regular buyer   M = Manufacturer   |   B = Big   M = Medium   S = Small" },
      {
        k: "table", fs: 6.5,
        head: [["S.No.", "Buyer name", "Contact person", "Email ID", "Contact number", "Country", "Website", "I/R/M", "B/M/S", "Intro mail", "Follow-up mail", "Personalised mail", "Calling time", "Skype", "Remarks"]],
        rows,
        w: [3, 11, 8, 11, 8, 6, 9, 3, 3, 6, 6, 6, 6, 6, 8],
        a: ["c", "l", "l", "l", "l", "l", "l", "c", "c", "l", "l", "l", "l", "l", "l"],
      },
    ];
  },
};

/* ═════════════ shared pieces for the three invoice-like documents ═════════════ */

const lineCols = {
  product: { k: "product", label: "Product description", span: 2 as const },
  other: { k: "otherDesc", label: "Other description", span: 2 as const },
  hs: { k: "hs", label: "HS code" },
  unit: { k: "unit", label: "Unit", kind: "select" as const, opts: UNITS },
  qty: { k: "qty", label: "Quantity", kind: "num" as const },
  boxes: { k: "boxes", label: "Total boxes", kind: "num" as const },
  cur: { k: "currency", label: "Currency", kind: "select" as const, opts: CURRENCIES, init: { master: "defaultCurrency" as const } },
  rate: { k: "rate", label: "Rate", kind: "num" as const },
};
const showQty = (v: string) => (v ? qty(num(v)) : "");
const showRate = (v: string) => (v ? fmt(num(v)) : "");

/* ═════════════ 06  EXPORT PROFORMA INVOICE ═════════════ */

const pi: ToolDef = {
  slug: "export-proforma-invoice", title: "Export Proforma Invoice", heading: "PROFORMA INVOICE", prefix: "PI",
  refLabel: "Per Invoice No.", dateLabel: "Per Invoice Date", kind: "doc", counts: true, showBank: true,
  next: ["export-sample-courier-invoice"],
  sections: [
    head("Per invoice no.", "Per invoice date"),
    {
      title: "Buyer",
      fields: [
        { k: "buyer", label: "Buyer / importer", kind: "area", span: 2, req: true, ph: "Name and full address" },
        { k: "buyerOther", label: "Buyer (if other than consignee)", kind: "area", span: 2 },
        { k: "buyerOrder", label: "Buyer's order no. & date", span: 2 },
        { k: "otherRef", label: "Other reference(s)", span: 2 },
      ],
    },
    {
      title: "Shipping details",
      fields: [
        { k: "originCountry", label: "Country of origin of goods", init: { master: "country" } },
        { k: "destCountry", label: "Country of final destination", req: true },
        { k: "portLoading", label: "Port of loading", init: { master: "defaultPortLoading" }, req: true },
        { k: "portDischarge", label: "Port of discharge", req: true },
        { k: "finalDest", label: "Final destination" },
        { k: "preCarriage", label: "Pre-carriage by" },
        { k: "placeReceipt", label: "Place of receipt by pre-carriage" },
        { k: "vessel", label: "Vessel / flight no." },
      ],
    },
    {
      title: "Terms of delivery and payment",
      fields: [
        { k: "incoterms", label: "Incoterms", kind: "select", opts: INCOTERMS, init: { master: "defaultIncoterm" }, req: true },
        { k: "paymentTerms", label: "Payment terms", kind: "area", span: 3, init: { master: "defaultPaymentTerms" }, req: true },
        { k: "transhipment", label: "Transhipment", kind: "select", opts: YES_NO },
        { k: "partial", label: "Partial shipment", kind: "select", opts: YES_NO },
        { k: "deliveryTerms", label: "Delivery terms", span: 2 },
        { k: "leadTime", label: "Lead delivery time", ph: "e.g. 15 days after advance" },
        { k: "tolerance", label: "Tolerance", ph: "e.g. +/- 5%" },
        { k: "validity", label: "Validity of P.I.", kind: "date" },
        { k: "netGross", label: "Net / gross weight", ph: "e.g. 12,000 / 12,600 KGS", span: 2 },
        { k: "totalCbm", label: "Total CBM", kind: "num" },
      ],
    },
  ],
  table: {
    title: "Products", itemLabel: "Item", min: 3, max: 14, amount: { qty: "qty", rate: "rate", cur: "currency" }, sum: ["qty", "boxes"],
    cols: [lineCols.product, lineCols.other, lineCols.hs, lineCols.unit, lineCols.qty, lineCols.boxes, lineCols.cur, lineCols.rate],
  },
  after: [remarks()],
  docTitle: (f) => `PI ${f.ref ?? ""}${f.buyer ? ` · ${first(f.buyer, 30)}` : ""}`.trim(),
  amountOf: (d) => amountOf(() => pi)(d),
  listing: [
    { label: "Buyer / importer", get: (d) => first(d.f.buyer, 28) || "—" },
    { label: "Country", get: (d) => d.f.destCountry || "—" },
    { label: "Port", get: (d) => d.f.portLoading || "—" },
    { label: "Incoterms", get: (d) => d.f.incoterms || "—" },
    { label: "Qty", get: (d) => qty(tableTotals(pi.table!, d).sums.qty) || "—", right: true },
    { label: "Amount", get: (d) => { const t = tableTotals(pi.table!, d); return t.amount ? `${t.cur} ${fmt(t.amount)}`.trim() : "—"; }, right: true },
  ],
  build: (d) => {
    const f = d.f;
    return [
      kv([
        ["Buyer / importer", f.buyer ?? "", 2], ["Buyer's order no. & date", f.buyerOrder ?? "", 2],
        ["Buyer (if other than consignee)", f.buyerOther ?? "", 2], ["Other reference(s)", f.otherRef ?? "", 2],
        ["Country of origin of goods", f.originCountry ?? ""], ["Country of final destination", f.destCountry ?? ""], ["Port of loading", f.portLoading ?? ""], ["Port of discharge", f.portDischarge ?? ""],
        ["Final destination", f.finalDest ?? ""], ["Pre-carriage by", f.preCarriage ?? ""], ["Place of receipt by pre-carriage", f.placeReceipt ?? ""], ["Vessel / flight no.", f.vessel ?? ""],
      ], 4),
      kv([
        ["Incoterms", f.incoterms ?? ""], ["Payment terms", f.paymentTerms ?? "", 3],
        ["Transhipment", f.transhipment ?? ""], ["Partial shipment", f.partial ?? ""], ["Delivery terms", f.deliveryTerms ?? "", 2],
        ["Lead delivery time", f.leadTime ?? ""], ["Tolerance", f.tolerance ?? ""], ["Validity of P.I.", fmtDate(f.validity)], ["Net / gross weight", f.netGross ?? "", 2], ["Total CBM", f.totalCbm ?? ""],
      ], 4, "Terms of delivery and payment"),
      ...linesBlock(pi, d, [
        { k: "product", label: "Product description", w: 22 }, { k: "otherDesc", label: "Other description", w: 17 }, { k: "hs", label: "HS code", w: 9 },
        { k: "unit", label: "Unit", w: 6 }, { k: "qty", label: "Quantity", a: "r", w: 9, show: showQty }, { k: "boxes", label: "Boxes", a: "r", w: 7, show: showQty },
        { k: "currency", label: "Cur.", w: 6 }, { k: "rate", label: "Rate", a: "r", w: 9, show: showRate },
      ], { sn: true }),
      ...(f.remarks ? [{ k: "text", l: "Remarks", v: f.remarks } as Block] : []),
    ];
  },
};

/* ═════════════ 07  EXPORT QUOTATION ═════════════ */

const quotation: ToolDef = {
  slug: "export-quotation", title: "Export Quotation", heading: "EXPORT QUOTATION", prefix: "QT",
  refLabel: "Quotation No.", dateLabel: "Quotation Date", kind: "doc", counts: true, showBank: false,
  next: ["export-proforma-invoice"],
  from: { "export-proforma-invoice": { buyer: "buyer" } },
  sections: [
    head("Quotation no.", "Quotation date"),
    {
      title: "Buyer",
      fields: [
        { k: "buyer", label: "Buyer name", span: 2, req: true },
        { k: "buyerCountry", label: "Buyer country", req: true },
        { k: "refNo", label: "Reference no." },
        { k: "productName", label: "Product name", span: 2 },
      ],
    },
  ],
  table: {
    title: "Products", itemLabel: "Item", min: 3, max: 12, amount: { qty: "qty", rate: "rate", cur: "currency" }, sum: ["qty"],
    cols: [lineCols.product, lineCols.hs, lineCols.other, lineCols.qty, lineCols.unit, lineCols.cur, { ...lineCols.rate, label: "Rate CIF" }],
  },
  after: [
    {
      title: "Sample",
      fields: [
        { k: "sampleDesc", label: "Sample description", span: 2, init: "( Sample not yet approved )" },
        { k: "sampleOther", label: "Other description", span: 2, init: "( Testing charges, inspection charges and special packaging charges will be extra as applicable )" },
      ],
    },
    {
      title: "Other details with terms & conditions",
      fields: [
        { k: "portLoading", label: "Port of loading", init: { master: "defaultPortLoading" }, req: true },
        { k: "portDischarge", label: "Port of discharge" },
        { k: "finalDest", label: "Final destination" },
        { k: "incoterms", label: "Incoterms", kind: "select", opts: INCOTERMS, init: { master: "defaultIncoterm" } },
        { k: "deliveryTime", label: "Delivery time" },
        { k: "shipDate", label: "Expected ship date", kind: "date" },
        { k: "shipType", label: "Shipment type", kind: "select", opts: ["FCL", "LCL", "Air", "Courier"] },
        { k: "containerSize", label: "Container size", kind: "select", opts: ["20' container", "40' GP container", "40' HQ container", "LCL"] },
        { k: "packaging", label: "Packaging / labeling", span: 2 },
        { k: "innerPack", label: "Total inner pack" },
        { k: "masterPack", label: "Total master pack" },
        { k: "packedDim", label: "Packed dimension" },
        { k: "packedWeight", label: "Packed weight" },
        { k: "packedCbm", label: "Packed CBM" },
        { k: "validity", label: "Quotation validity", kind: "date", req: true },
        { k: "special", label: "Special instructions", span: 4 },
        { k: "paymentTerms", label: "Payment terms", kind: "area", span: 4, init: { master: "defaultPaymentTerms" } },
      ],
    },
    remarks(),
  ],
  docTitle: (f) => `Quotation ${f.ref ?? ""}${f.buyer ? ` · ${first(f.buyer, 30)}` : ""}`.trim(),
  amountOf: (d) => amountOf(() => quotation)(d),
  listing: [
    { label: "Buyer", get: (d) => first(d.f.buyer, 28) || "—" },
    { label: "Country", get: (d) => d.f.buyerCountry || "—" },
    { label: "Validity", get: (d) => fmtDate(d.f.validity) || "—" },
    { label: "Amount", get: (d) => { const t = tableTotals(quotation.table!, d); return t.amount ? `${t.cur} ${fmt(t.amount)}`.trim() : "—"; }, right: true },
  ],
  build: (d) => {
    const f = d.f;
    return [
      ...linesBlock(quotation, d, [
        { k: "product", label: "Product description", w: 27 }, { k: "hs", label: "HS code", w: 10 }, { k: "otherDesc", label: "Other description", w: 20 },
        { k: "qty", label: "Quantity", a: "r", w: 9, show: showQty }, { k: "unit", label: "Unit", w: 7 }, { k: "currency", label: "Cur.", w: 6 }, { k: "rate", label: "Rate CIF", a: "r", w: 10, show: showRate },
      ], { sn: true }),
      kv([["Sample description", f.sampleDesc ?? "", 2], ["Other description", f.sampleOther ?? "", 2]], 4),
      kv([
        ["Product name", f.productName ?? ""], ["Port of loading", f.portLoading ?? ""],
        ["Buyer name", f.buyer ?? ""], ["Port of discharge", f.portDischarge ?? ""],
        ["Buyer country", f.buyerCountry ?? ""], ["Final destination", f.finalDest ?? ""],
        ["Reference no.", f.refNo ?? ""], ["Inco terms", f.incoterms ?? ""],
        ["Delivery time", f.deliveryTime ?? ""], ["Shipment type", f.shipType ?? ""],
        ["Expected ship date", fmtDate(f.shipDate)], ["Total inner pack", f.innerPack ?? ""],
        ["Packaging / labeling", f.packaging ?? ""], ["Total master pack", f.masterPack ?? ""],
        ["Packed dimension", f.packedDim ?? ""], ["Container size", f.containerSize ?? ""],
        ["Packed weight", f.packedWeight ?? ""], ["Quotation validity", fmtDate(f.validity)],
        ["Packed CBM", f.packedCbm ?? ""], ["Special instructions", f.special ?? ""],
      ], 2, "Other details with terms & conditions"),
      ...(f.paymentTerms ? [{ k: "text", l: "Payment terms", v: f.paymentTerms } as Block] : []),
      ...(f.remarks ? [{ k: "text", l: "Remarks", v: f.remarks } as Block] : []),
    ];
  },
};

/* ═════════════ 08  EXPORT SAMPLE COURIER INVOICE ═════════════ */

const courier: ToolDef = {
  slug: "export-sample-courier-invoice", title: "Export Sample Courier Invoice", heading: "SAMPLE COURIER INVOICE", prefix: "SCI",
  refLabel: "Invoice No.", dateLabel: "Invoice Date", kind: "doc", counts: true,
  from: { "export-proforma-invoice": { consignee: "buyer", notify: "buyerOther" } },
  sections: [
    head("Invoice no.", "Invoice date"),
    {
      title: "Consignee",
      fields: [
        { k: "consignee", label: "Consignee", kind: "area", span: 2, req: true, ph: "Name and full address" },
        { k: "notify", label: "Notify party", kind: "area", span: 2, ph: "Leave empty for 'Same as consignee'" },
        { k: "otherRef", label: "Other reference(s)", span: 2 },
      ],
    },
    {
      title: "Shipping details",
      fields: [
        { k: "originCountry", label: "Country of origin of goods", init: { master: "country" } },
        { k: "destCountry", label: "Country of final destination", req: true },
        { k: "portLoading", label: "Port of loading", init: { master: "defaultPortLoading" }, req: true },
        { k: "portDischarge", label: "Port of discharge" },
        { k: "finalDest", label: "Final destination" },
        { k: "vessel", label: "Vessel / flight no." },
        { k: "preCarriage", label: "Pre-carriage by" },
        { k: "placeReceipt", label: "Place of receipt by pre-carriage" },
      ],
    },
    {
      title: "Terms of delivery and payment",
      fields: [
        { k: "deliveryTerms", label: "Delivery terms", span: 2 },
        { k: "incoterms", label: "Incoterms", kind: "select", opts: INCOTERMS, init: { master: "defaultIncoterm" }, req: true },
        { k: "paymentTerms", label: "Payment terms", kind: "area", span: 2, init: { master: "defaultPaymentTerms" } },
        { k: "otherTerms", label: "Other terms", kind: "area", span: 2 },
        { k: "marks", label: "Marks & nos. / no. & kind of pkgs.", span: 2 },
        { k: "grossWt", label: "Gross weight" },
        { k: "netWt", label: "Net weight" },
      ],
    },
  ],
  table: {
    title: "Products", itemLabel: "Item", min: 3, max: 13, amount: { qty: "qty", rate: "rate", cur: "currency" }, sum: ["qty", "boxes"],
    cols: [lineCols.product, lineCols.other, lineCols.hs, lineCols.unit, lineCols.qty, lineCols.boxes, lineCols.cur, lineCols.rate],
  },
  after: [remarks()],
  docTitle: (f) => `Sample invoice ${f.ref ?? ""}${f.consignee ? ` · ${first(f.consignee, 30)}` : ""}`.trim(),
  amountOf: (d) => amountOf(() => courier)(d),
  listing: [
    { label: "Consignee", get: (d) => first(d.f.consignee, 26) || "—" },
    { label: "Notify party", get: (d) => first(d.f.notify, 20) || "Same as consignee" },
    { label: "Port", get: (d) => d.f.portLoading || "—" },
    { label: "Incoterms", get: (d) => d.f.incoterms || "—" },
    { label: "Qty", get: (d) => qty(tableTotals(courier.table!, d).sums.qty) || "—", right: true },
    { label: "Amount", get: (d) => { const t = tableTotals(courier.table!, d); return t.amount ? `${t.cur} ${fmt(t.amount)}`.trim() : "—"; }, right: true },
  ],
  build: (d) => {
    const f = d.f;
    return [
      kv([
        ["Consignee", f.consignee ?? "", 2], ["Other reference(s)", f.otherRef ?? "", 2],
        ["Notify party", f.notify || "Same as consignee", 2], ["Pre-carriage by", f.preCarriage ?? ""], ["Place of receipt by pre-carriage", f.placeReceipt ?? ""],
        ["Country of origin of goods", f.originCountry ?? ""], ["Country of final destination", f.destCountry ?? ""], ["Port of loading", f.portLoading ?? ""], ["Port of discharge", f.portDischarge ?? ""],
        ["Final destination", f.finalDest ?? ""], ["Vessel / flight no.", f.vessel ?? ""],
      ], 4),
      kv([
        ["Delivery terms", f.deliveryTerms ?? "", 2], ["Incoterms", f.incoterms ?? ""], ["Payment terms", f.paymentTerms ?? "", 1],
        ["Other terms", f.otherTerms ?? "", 2], ["Marks & nos. / no. & kind of pkgs.", f.marks ?? ""], ["Gross wt. / Net wt.", [f.grossWt, f.netWt].filter(Boolean).join(" / ")],
      ], 4, "Terms of delivery and payment"),
      ...linesBlock(courier, d, [
        { k: "product", label: "Product description", w: 22 }, { k: "otherDesc", label: "Other description", w: 17 }, { k: "hs", label: "HS code", w: 9 },
        { k: "unit", label: "Unit", w: 6 }, { k: "qty", label: "Quantity", a: "r", w: 9, show: showQty }, { k: "boxes", label: "Boxes", a: "r", w: 7, show: showQty },
        { k: "currency", label: "Cur.", w: 6 }, { k: "rate", label: "Rate", a: "r", w: 9, show: showRate },
      ], { sn: true }),
      ...(f.remarks ? [{ k: "text", l: "Remarks", v: f.remarks } as Block] : []),
    ];
  },
};

/* ═════════════ 09  IMPORT PURCHASE ORDER (no Excel sheet yet) ═════════════ */

const po: ToolDef = {
  slug: "import-purchase-order", title: "Import Purchase Order", heading: "PURCHASE ORDER", prefix: "PO",
  refLabel: "PO No.", dateLabel: "PO Date", kind: "doc", counts: true, showBank: false,
  sections: [
    head("PO no.", "PO date"),
    {
      title: "Supplier and delivery",
      fields: [
        { k: "supplier", label: "Supplier", kind: "area", span: 2, req: true, ph: "Name and full address" },
        { k: "deliverTo", label: "Deliver to", kind: "area", span: 2, ph: "Warehouse / address" },
        { k: "supplierCountry", label: "Supplier country" },
        { k: "portDischarge", label: "Port of discharge" },
        { k: "incoterms", label: "Incoterms", kind: "select", opts: INCOTERMS, init: { master: "defaultIncoterm" } },
        { k: "needBy", label: "Required by", kind: "date" },
        { k: "paymentTerms", label: "Payment terms", kind: "area", span: 4, init: { master: "defaultPaymentTerms" } },
      ],
    },
  ],
  table: {
    title: "Items ordered", itemLabel: "Item", min: 3, max: 14, amount: { qty: "qty", rate: "rate", cur: "currency" }, sum: ["qty"],
    cols: [lineCols.product, lineCols.hs, lineCols.unit, lineCols.qty, lineCols.cur, lineCols.rate],
  },
  after: [remarks("Special instructions")],
  docTitle: (f) => `PO ${f.ref ?? ""}${f.supplier ? ` · ${first(f.supplier, 30)}` : ""}`.trim(),
  amountOf: (d) => amountOf(() => po)(d),
  listing: [
    { label: "Supplier", get: (d) => first(d.f.supplier, 28) || "—" },
    { label: "Required by", get: (d) => fmtDate(d.f.needBy) || "—" },
    { label: "Amount", get: (d) => { const t = tableTotals(po.table!, d); return t.amount ? `${t.cur} ${fmt(t.amount)}`.trim() : "—"; }, right: true },
  ],
  build: (d) => {
    const f = d.f;
    return [
      kv([
        ["Supplier", f.supplier ?? "", 2], ["Deliver to", f.deliverTo ?? "", 2],
        ["Supplier country", f.supplierCountry ?? ""], ["Port of discharge", f.portDischarge ?? ""], ["Incoterms", f.incoterms ?? ""], ["Required by", fmtDate(f.needBy)],
        ["Payment terms", f.paymentTerms ?? "", 4],
      ], 4),
      ...linesBlock(po, d, [
        { k: "product", label: "Product description", w: 34 }, { k: "hs", label: "HS code", w: 11 }, { k: "unit", label: "Unit", w: 7 },
        { k: "qty", label: "Quantity", a: "r", w: 10, show: showQty }, { k: "currency", label: "Cur.", w: 7 }, { k: "rate", label: "Rate", a: "r", w: 10, show: showRate },
      ], { sn: true }),
      ...(f.remarks ? [{ k: "text", l: "Special instructions", v: f.remarks } as Block] : []),
    ];
  },
};

/* ═════════════ 10–12  LETTERS (no Excel sheet yet) ═════════════ */

const nm = (c: { name: string }) => c.name || "our company";
const effective = (def: ToolDef, d: DocData) => d.f.body?.trim() || def.makeBody!(d.f, d.co);

function letterDef(o: {
  slug: string; title: string; heading: string; prefix: string; next?: string[];
  extra: Section[]; subject: (f: Fields) => string; make: (f: Fields, co: DocData["co"]) => string; docTitle: (f: Fields) => string;
}): ToolDef {
  const def: ToolDef = {
    slug: o.slug, title: o.title, heading: o.heading, prefix: o.prefix, refLabel: "Our ref.", dateLabel: "Date", kind: "letter", counts: true, next: o.next,
    letter: { to: ["contact", "company", "address", "country"], sign: ["senderName", "designation"] },
    sections: [
      {
        title: "Letter details",
        fields: [
          { k: "ref", label: "Our ref.", init: "ref", req: true },
          { k: "date", label: "Date", kind: "date", init: "today", req: true },
          { k: "contact", label: "Contact person", ph: "Optional" },
          { k: "company", label: "Company", req: true },
          { k: "address", label: "Address", span: 3 },
          { k: "country", label: "Country" },
        ],
      },
      ...o.extra,
      {
        title: "From you",
        fields: [
          { k: "senderName", label: "Your name", init: { master: "preparedBy" }, req: true },
          { k: "designation", label: "Your designation" },
        ],
      },
    ],
    makeBody: o.make,
    docTitle: o.docTitle,
    listing: [
      { label: "To", get: (d) => d.f.company || "—" },
      { label: "Country", get: (d) => d.f.country || "—" },
    ],
    build: (d) => {
      const f = d.f;
      const to = [f.contact, f.company, f.address, f.country].filter(Boolean).join("\n");
      return [
        { k: "para", v: to, gap: 6 },
        { k: "para", v: `Subject: ${o.subject(f)}`, b: true, gap: 12 },
        { k: "para", v: effective(def, d), gap: 24 },
        { k: "para", v: [f.senderName, f.designation, d.co.name].filter(Boolean).join("\n"), b: false },
      ];
    },
  };
  return def;
}

const inquiry = letterDef({
  slug: "import-letter-for-inquiry", title: "Import Letter for Inquiry", heading: "INQUIRY LETTER", prefix: "IL",
  extra: [{
    title: "What you need",
    fields: [
      { k: "product", label: "Product", span: 2, req: true },
      { k: "quantity", label: "Quantity required" },
      { k: "incoterm", label: "Price basis", kind: "select", opts: INCOTERMS, init: "CIF" },
      { k: "port", label: "Destination port" },
      { k: "specs", label: "Specifications", kind: "area", span: 4 },
    ],
  }],
  subject: (f) => `Inquiry for ${f.product || "your products"}`,
  docTitle: (f) => `Inquiry${f.product ? ` · ${first(f.product, 30)}` : ""}`,
  make: (f, co) => [
    `Dear ${f.contact || "Sir or Madam"},`,
    `We are ${nm(co)} and we are interested in importing ${f.product || "your products"}. We would like to request your best quotation.`,
    "Please share the following details:",
    [
      f.specs && `- Specifications: ${f.specs}`,
      f.quantity && `- Quantity required: ${f.quantity}`,
      `- Price on ${f.incoterm || "CIF"}${f.port ? ` ${f.port}` : ""} basis`,
      "- Minimum order quantity, packing and lead time",
      "- Payment terms and validity of your offer",
    ].filter(Boolean).join("\n"),
    "We look forward to your reply and to a long-term business relationship.",
    "Yours faithfully,",
  ].join("\n\n"),
});

const followUp = letterDef({
  slug: "export-follow-up-mail", title: "Export Follow Up Mail", heading: "FOLLOW-UP MAIL", prefix: "FU",
  extra: [{
    title: "Your last mail",
    fields: [
      { k: "lastMail", label: "Date of your last mail", kind: "date" },
      { k: "products", label: "Products you offered", span: 3 },
    ],
  }],
  subject: (f) => `Follow-up: ${f.products || "our earlier mail"}`,
  docTitle: (f) => `Follow-up${f.company ? ` · ${first(f.company, 30)}` : ""}`,
  make: (f, co) => [
    `Dear ${f.contact || "Sir or Madam"},`,
    `I hope you are well. I wrote to you${f.lastMail ? ` on ${fmtDate(f.lastMail)}` : " earlier"} about ${f.products || "our products"} from ${nm(co)}. I wanted to check whether you had a chance to look at it.`,
    "If you would like our catalogue, price list or samples, I will be happy to send them. Please let me know a good time to talk.",
    "Thank you for your time.",
    "Best regards,",
  ].join("\n\n"),
});

const intro = letterDef({
  slug: "export-marketing-buyers-intro-letter", title: "Export Marketing (Buyers Intro Letter)", heading: "INTRODUCTION LETTER", prefix: "BI",
  next: ["export-follow-up-mail"],
  extra: [{
    title: "Your offer",
    fields: [
      { k: "products", label: "Products you export", span: 4, req: true },
      { k: "strengths", label: "Why buyers choose you", kind: "area", span: 2 },
      { k: "offer", label: "What you can offer (MOQ, packing, samples)", kind: "area", span: 2 },
    ],
  }],
  subject: (f) => `Introduction: ${f.products || "our products"}`,
  docTitle: (f) => `Introduction${f.company ? ` · ${first(f.company, 30)}` : ""}`,
  make: (f, co) => [
    `Dear ${f.contact || "Sir or Madam"},`,
    `We are ${nm(co)}${f.products ? `, an exporter of ${f.products}` : ""}. We are writing to introduce our company and to explore how we can supply ${f.company || "your business"}.`,
    f.strengths, f.offer,
    "We would be happy to send our catalogue, price list and samples on request.",
    "We look forward to hearing from you.",
    "Yours sincerely,",
  ].filter(Boolean).join("\n\n"),
});

export const TOOL_DEFS: Record<string, ToolDef> = Object.fromEntries(
  [cbm, fob, costing, costing2, filter, pi, quotation, courier, po, inquiry, followUp, intro].map((d) => [d.slug, d]),
);
export const effectiveLetter = effective;
