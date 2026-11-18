import { sanitizeProforma } from "@/lib/proforma";

// Tools that already have a working generator. The rest show "being built".
export const GENERATORS: Record<string, { sanitize: (raw: unknown) => unknown; title: (d: never) => string }> = {
  "export-proforma-invoice": {
    sanitize: sanitizeProforma,
    title: ((d: { invoiceNo: string }) =>
      d.invoiceNo ? `Proforma Invoice ${d.invoiceNo}` : "Proforma Invoice") as (d: never) => string,
  },
};

export const hasGenerator = (slug: string) => slug in GENERATORS;
