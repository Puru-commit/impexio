import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { lineAmount, money, totals, type Proforma } from "@/lib/proforma";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 9, fontFamily: "Helvetica", color: "#111" },
  row: { flexDirection: "row" },
  head: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#999" },
  company: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "right" },
  muted: { color: "#555" },
  label: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#666", letterSpacing: 1, marginBottom: 3 },
  th: { backgroundColor: "#eee", fontFamily: "Helvetica-Bold", fontSize: 8, padding: 4 },
  td: { padding: 4, borderBottomWidth: 0.5, borderBottomColor: "#ccc" },
  foot: { position: "absolute", left: 36, right: 36, bottom: 24, fontSize: 7, color: "#777", borderTopWidth: 0.5, borderTopColor: "#bbb", paddingTop: 4 },
});

const W = { n: 22, desc: 258, hs: 55, qty: 62, rate: 60, amt: 66 };

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <Text style={{ marginBottom: 1.5 }}>
      <Text style={s.muted}>{k}: </Text>
      {v || "-"}
    </Text>
  );
}

export function InvoicePdf({ d }: { d: Proforma }) {
  const t = totals(d);
  const ids = [d.exporter.gstin && `GSTIN ${d.exporter.gstin}`, d.exporter.iec && `IEC ${d.exporter.iec}`]
    .filter(Boolean)
    .join("  |  ");

  return (
    <Document title={`Proforma Invoice ${d.invoiceNo}`} author={d.exporter.name || "IMPEXIO"}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View style={{ maxWidth: 270 }}>
            <Text style={s.company}>{d.exporter.name || "Company name"}</Text>
            <Text style={[s.muted, { marginTop: 3 }]}>{d.exporter.address}</Text>
            <Text style={s.muted}>{[d.exporter.phone, d.exporter.email].filter(Boolean).join("  |  ")}</Text>
            {ids ? <Text style={s.muted}>{ids}</Text> : null}
          </View>
          <View>
            <Text style={s.title}>PROFORMA INVOICE</Text>
            <Text style={{ textAlign: "right", marginTop: 4 }}>No: {d.invoiceNo || "-"}</Text>
            <Text style={{ textAlign: "right" }}>Date: {d.date || "-"}</Text>
            {d.validUntil ? <Text style={{ textAlign: "right" }}>Valid until: {d.validUntil}</Text> : null}
            {d.buyerRef ? <Text style={{ textAlign: "right" }}>Buyer ref: {d.buyerRef}</Text> : null}
          </View>
        </View>

        <View style={[s.row, { marginTop: 14, gap: 20 }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>CONSIGNEE / BUYER</Text>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{d.consignee.name || "-"}</Text>
            <Text>{d.consignee.address}</Text>
            <Text>{d.consignee.country}</Text>
            <Text>{[d.consignee.phone, d.consignee.email].filter(Boolean).join("  |  ")}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>SHIPMENT</Text>
            <Meta k="Incoterm" v={d.incoterm} />
            <Meta k="Port of loading" v={d.portLoading} />
            <Meta k="Port of discharge" v={d.portDischarge} />
            <Meta k="Country of origin" v={d.countryOrigin} />
            <Meta k="Final destination" v={d.countryDestination} />
            <Meta k="Payment terms" v={d.paymentTerms} />
            <Meta k="Delivery time" v={d.deliveryTime} />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <View style={s.row}>
            <Text style={[s.th, { width: W.n }]}>#</Text>
            <Text style={[s.th, { width: W.desc }]}>DESCRIPTION</Text>
            <Text style={[s.th, { width: W.hs }]}>HS CODE</Text>
            <Text style={[s.th, { width: W.qty, textAlign: "right" }]}>QTY</Text>
            <Text style={[s.th, { width: W.rate, textAlign: "right" }]}>RATE</Text>
            <Text style={[s.th, { width: W.amt, textAlign: "right" }]}>AMOUNT</Text>
          </View>
          {d.items.map((i, n) => (
            <View key={n} style={s.row} wrap={false}>
              <Text style={[s.td, { width: W.n }]}>{n + 1}</Text>
              <Text style={[s.td, { width: W.desc }]}>{i.description || "-"}</Text>
              <Text style={[s.td, { width: W.hs }]}>{i.hsCode}</Text>
              <Text style={[s.td, { width: W.qty, textAlign: "right" }]}>{i.qty} {i.unit}</Text>
              <Text style={[s.td, { width: W.rate, textAlign: "right" }]}>{money(i.rate)}</Text>
              <Text style={[s.td, { width: W.amt, textAlign: "right" }]}>{money(lineAmount(i))}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10, alignSelf: "flex-end", width: 190 }} wrap={false}>
          <View style={[s.row, { justifyContent: "space-between", marginBottom: 2 }]}>
            <Text>Subtotal</Text><Text>{money(t.subtotal)}</Text>
          </View>
          {d.freight > 0 && (
            <View style={[s.row, { justifyContent: "space-between", marginBottom: 2 }]}>
              <Text>Freight</Text><Text>{money(d.freight)}</Text>
            </View>
          )}
          {d.insurance > 0 && (
            <View style={[s.row, { justifyContent: "space-between", marginBottom: 2 }]}>
              <Text>Insurance</Text><Text>{money(d.insurance)}</Text>
            </View>
          )}
          <View style={[s.row, { justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#666", paddingTop: 3, fontFamily: "Helvetica-Bold", fontSize: 11 }]}>
            <Text>Total ({d.currency})</Text><Text>{money(t.total)}</Text>
          </View>
        </View>

        {(d.bank.name || d.bank.accountNo) && (
          <View style={{ marginTop: 18 }} wrap={false}>
            <Text style={s.label}>BANK DETAILS</Text>
            <Text>{d.bank.name}</Text>
            <Text>{[d.bank.accountName, d.bank.accountNo && `A/C ${d.bank.accountNo}`].filter(Boolean).join("  |  ")}</Text>
            <Text>{[d.bank.ifsc && `IFSC ${d.bank.ifsc}`, d.bank.swift && `SWIFT ${d.bank.swift}`].filter(Boolean).join("  |  ")}</Text>
          </View>
        )}

        {d.notes ? (
          <View style={{ marginTop: 14 }} wrap={false}>
            <Text style={s.label}>NOTES</Text>
            <Text>{d.notes}</Text>
          </View>
        ) : null}

        <Text style={s.foot} fixed>
          This is a proforma invoice for quotation purposes and is not a tax invoice. Prepared with IMPEXIO.
        </Text>
      </Page>
    </Document>
  );
}
