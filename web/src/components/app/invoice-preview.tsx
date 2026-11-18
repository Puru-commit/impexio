import { lineAmount, money, totals, type Proforma } from "@/lib/proforma";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-neutral-500">{title}</p>
      <div className="mt-1 space-y-0.5 text-[11px] leading-snug">{children}</div>
    </div>
  );
}

/** On-screen A4-style preview of the invoice. */
export function InvoicePreview({ d }: { d: Proforma }) {
  const t = totals(d);
  const meta: [string, string][] = [
    ["Incoterm", d.incoterm],
    ["Port of loading", d.portLoading],
    ["Port of discharge", d.portDischarge],
    ["Country of origin", d.countryOrigin],
    ["Final destination", d.countryDestination],
    ["Payment terms", d.paymentTerms],
    ["Delivery time", d.deliveryTime],
  ];

  return (
    <div className="rounded-lg border border-border bg-white p-6 text-[#111] shadow-[0_30px_60px_-40px_rgba(11,16,32,0.5)]">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-300 pb-4">
        <div>
          <p className="text-base font-bold">{d.exporter.name || "Your company name"}</p>
          <p className="mt-1 max-w-[240px] text-[11px] text-neutral-600">{d.exporter.address}</p>
          <p className="text-[11px] text-neutral-600">
            {[d.exporter.phone, d.exporter.email].filter(Boolean).join(" · ")}
          </p>
          <p className="text-[11px] text-neutral-600">
            {[d.exporter.gstin && `GSTIN ${d.exporter.gstin}`, d.exporter.iec && `IEC ${d.exporter.iec}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tracking-wide">PROFORMA INVOICE</p>
          <p className="mt-1 text-[11px]">No: {d.invoiceNo || "—"}</p>
          <p className="text-[11px]">Date: {d.date || "—"}</p>
          {d.validUntil && <p className="text-[11px]">Valid until: {d.validUntil}</p>}
          {d.buyerRef && <p className="text-[11px]">Buyer ref: {d.buyerRef}</p>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Block title="Consignee / Buyer">
          <p className="font-semibold">{d.consignee.name || "—"}</p>
          <p>{d.consignee.address}</p>
          <p>{d.consignee.country}</p>
          <p>{[d.consignee.phone, d.consignee.email].filter(Boolean).join(" · ")}</p>
        </Block>
        <Block title="Shipment">
          {meta.map(([k, v]) => (
            <p key={k}>
              <span className="text-neutral-500">{k}: </span>
              {v || "—"}
            </p>
          ))}
        </Block>
      </div>

      <table className="mt-5 w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-neutral-100 text-left text-[10px] uppercase tracking-wide">
            <th className="p-1.5">#</th>
            <th className="p-1.5">Description</th>
            <th className="p-1.5">HS</th>
            <th className="p-1.5 text-right">Qty</th>
            <th className="p-1.5 text-right">Rate</th>
            <th className="p-1.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {d.items.map((i, n) => (
            <tr key={n} className="border-b border-neutral-200 align-top">
              <td className="p-1.5">{n + 1}</td>
              <td className="p-1.5">{i.description || "—"}</td>
              <td className="p-1.5">{i.hsCode}</td>
              <td className="p-1.5 text-right">
                {i.qty} {i.unit}
              </td>
              <td className="p-1.5 text-right">{money(i.rate)}</td>
              <td className="p-1.5 text-right">{money(lineAmount(i))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto mt-3 w-56 space-y-1 text-[11px]">
        <p className="flex justify-between"><span>Subtotal</span><span>{money(t.subtotal)}</span></p>
        {d.freight > 0 && <p className="flex justify-between"><span>Freight</span><span>{money(d.freight)}</span></p>}
        {d.insurance > 0 && <p className="flex justify-between"><span>Insurance</span><span>{money(d.insurance)}</span></p>}
        <p className="flex justify-between border-t border-neutral-400 pt-1 text-xs font-bold">
          <span>Total ({d.currency})</span><span>{money(t.total)}</span>
        </p>
      </div>

      {(d.bank.name || d.bank.accountNo) && (
        <div className="mt-5">
          <Block title="Bank details">
            <p>{d.bank.name}</p>
            <p>{[d.bank.accountName, d.bank.accountNo && `A/C ${d.bank.accountNo}`].filter(Boolean).join(" · ")}</p>
            <p>{[d.bank.ifsc && `IFSC ${d.bank.ifsc}`, d.bank.swift && `SWIFT ${d.bank.swift}`].filter(Boolean).join(" · ")}</p>
          </Block>
        </div>
      )}

      {d.notes && (
        <div className="mt-4">
          <Block title="Notes"><p className="whitespace-pre-line">{d.notes}</p></Block>
        </div>
      )}

      <p className="mt-6 border-t border-neutral-300 pt-2 text-[9px] text-neutral-500">
        This is a proforma invoice for quotation purposes and is not a tax invoice. Prepared with IMPEXIO.
      </p>
    </div>
  );
}
