import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Block, Cell, View as DocView } from "@/lib/doc/core";

const s = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: "Helvetica", color: "#111", lineHeight: 1.35 },
  title: { fontSize: 15, fontFamily: "Helvetica-Bold", textAlign: "right" },
  muted: { color: "#555" },
  label: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: "#777", letterSpacing: 0.8, textTransform: "uppercase" },
  h: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#7a5a16", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 },
});
const cell = (c: Cell) => (typeof c === "string" ? { t: c } : c);
const bgOf = (b?: string) => (b === "head" ? "#ece7da" : b === "sub" ? "#f4f1ea" : b === "total" ? "#f4efe2" : undefined);

function BlockPdf({ b }: { b: Block }) {
  if (b.k === "kv") {
    return (
      <View style={{ marginTop: 10 }} wrap={false}>
        {b.title ? <Text style={s.h}>{b.title}</Text> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", borderTopWidth: 0.7, borderLeftWidth: 0.7, borderColor: "#bbb" }}>
          {b.cells.map((c, i) => (
            <View key={i} style={{ width: `${(Math.min(c.span ?? 1, b.cols) / b.cols) * 100}%`, borderRightWidth: 0.7, borderBottomWidth: 0.7, borderColor: "#bbb", padding: 3, minHeight: 26 }}>
              <Text style={s.label}>{c.l}</Text>
              <Text style={{ fontSize: 8.5 }}>{c.v}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
  if (b.k === "table") {
    const total = b.w.reduce((a, x) => a + x, 0);
    const fs = b.fs ?? 8;
    const widthOf = (idx: number, span = 1) => `${(b.w.slice(idx, idx + span).reduce((a, x) => a + x, 0) / total) * 100}%`;
    const Row = ({ row, headRow }: { row: Cell[]; headRow?: boolean }) => {
      let col = 0;
      return (
        <View style={{ flexDirection: "row" }} wrap={false}>
          {row.map((c0, i) => {
            const c = cell(c0);
            const at = col;
            col += c.span ?? 1;
            const a = c.a ?? b.a[at] ?? "l";
            return (
              <View key={i} style={{ width: widthOf(at, c.span), borderRightWidth: 0.5, borderBottomWidth: 0.5, borderColor: "#c9c3b2", padding: 2.5, backgroundColor: headRow ? "#ece7da" : bgOf(c.bg) }}>
                <Text style={{ fontSize: headRow ? fs - 0.8 : fs, fontFamily: headRow || c.b ? "Helvetica-Bold" : "Helvetica", textAlign: a === "r" ? "right" : a === "c" ? "center" : "left" }}>{c.t}</Text>
              </View>
            );
          })}
        </View>
      );
    };
    return (
      <View style={{ marginTop: 10 }}>
        {b.title ? <Text style={s.h}>{b.title}</Text> : null}
        <View style={{ borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: "#c9c3b2" }}>
          {b.head.map((r, i) => <Row key={`h${i}`} row={r} headRow />)}
          {b.rows.map((r, i) => <Row key={i} row={r} />)}
        </View>
      </View>
    );
  }
  if (b.k === "words") return <Text style={{ marginTop: 8 }}><Text style={{ fontFamily: "Helvetica-Bold", fontSize: 7 }}>AMOUNT IN WORDS: </Text>{b.v}</Text>;
  if (b.k === "text") return <View style={{ marginTop: 9 }}><Text style={s.label}>{b.l}</Text><Text>{b.v}</Text></View>;
  return <Text style={{ marginTop: (b.gap ?? 8) * 0.8, fontSize: 10, lineHeight: 1.5, fontFamily: b.b ? "Helvetica-Bold" : "Helvetica" }}>{b.v}</Text>;
}

export function DocPdf({ view, title }: { view: DocView; title: string }) {
  return (
    <Document title={title} author={view.co.name || "IMPEXIO"}>
      <Page size="A4" orientation={view.landscape ? "landscape" : "portrait"} style={[s.page, view.letter ? { padding: 52, fontSize: 10 } : {}]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1.5, borderBottomColor: "#0b1020", paddingBottom: 8 }}>
          <View style={{ maxWidth: "58%" }}>
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold" }}>{view.co.name || "Company name"}</Text>
            {view.co.address ? <Text style={[s.muted, { marginTop: 2 }]}>{view.co.address}</Text> : null}
            <Text style={s.muted}>{[view.co.phone, view.co.email, view.co.website].filter(Boolean).join("  |  ")}</Text>
            <Text style={s.muted}>{[view.co.gstin && `GSTIN ${view.co.gstin}`, view.co.iec && `IEC ${view.co.iec}`, view.co.pan && `PAN ${view.co.pan}`].filter(Boolean).join("  |  ")}</Text>
          </View>
          <View>
            <Text style={s.title}>{view.heading}</Text>
            {view.meta.filter(([, v]) => v).map(([l, v]) => (
              <Text key={l} style={{ textAlign: "right", marginTop: 2 }}><Text style={{ color: "#777", fontSize: 7 }}>{l.toUpperCase()}: </Text><Text style={{ fontFamily: "Helvetica-Bold" }}>{v}</Text></Text>
            ))}
          </View>
        </View>
        {view.strip.length > 0 && (
          <Text style={{ marginTop: 6, fontSize: 8.5, color: "#444" }}>{view.strip.map(([l, v]) => `${l}: ${v}`).join("      ")}</Text>
        )}
        {view.blocks.map((b, i) => <BlockPdf key={i} b={b} />)}
        {view.bank ? (
          <Text style={{ marginTop: 14, fontSize: 8, color: "#444", borderTopWidth: 0.5, borderTopColor: "#bbb", paddingTop: 5 }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>BANK DETAILS  </Text>{view.bank.map(([l, v]) => `${l}: ${v}`).join("   |   ")}
          </Text>
        ) : null}
        <Text fixed style={{ position: "absolute", bottom: 14, left: 30, right: 30, textAlign: "center", fontSize: 7, color: "#999" }}>Prepared with IMPEXIO — Global Trade Simplified</Text>
      </Page>
    </Document>
  );
}
