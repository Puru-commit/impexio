"use client";

import { useEffect, useRef, useState } from "react";
import type { Block, Cell, View } from "@/lib/doc/core";

const cell = (c: Cell) => (typeof c === "string" ? { t: c } : c);
const bgOf = (b?: string) => (b === "head" ? "#ece7da" : b === "sub" ? "#f4f1ea" : b === "total" ? "#f4efe2" : undefined);

function BlockView({ b }: { b: Block }) {
  if (b.k === "kv") {
    return (
      <div style={{ marginTop: 14 }}>
        {b.title && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#7a5a16", marginBottom: 4 }}>{b.title}</div>}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${b.cols}, 1fr)`, border: "1px solid #cfc8b6" }}>
          {b.cells.map((c, i) => (
            <div key={i} style={{ gridColumn: `span ${Math.min(c.span ?? 1, b.cols)}`, padding: "5px 8px", borderRight: "1px solid #e4dfd0", borderBottom: "1px solid #e4dfd0", minHeight: 38 }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "#777" }}>{c.l}</div>
              <div style={{ fontSize: 11, whiteSpace: "pre-line", marginTop: 1 }}>{c.v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (b.k === "table") {
    const total = b.w.reduce((a, x) => a + x, 0);
    const fs = (b.fs ?? 9) * 1.25;
    return (
      <div style={{ marginTop: 14 }}>
        {b.title && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#7a5a16", marginBottom: 4 }}>{b.title}</div>}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: fs, tableLayout: "fixed" }}>
          <colgroup>{b.w.map((w, i) => <col key={i} style={{ width: `${(w / total) * 100}%` }} />)}</colgroup>
          <thead>
            {b.head.map((row, ri) => (
              <tr key={ri}>
                {row.map((c0, ci) => {
                  const c = cell(c0);
                  return <th key={ci} colSpan={c.span} style={{ background: "#ece7da", border: "1px solid #cfc8b6", padding: "4px 5px", textAlign: c.a === "c" ? "center" : b.a[ci] === "r" ? "right" : "left", fontSize: fs * 0.85, fontWeight: 700, letterSpacing: 0.3 }}>{c.t}</th>;
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {b.rows.map((row, ri) => {
              let col = 0;
              return (
                <tr key={ri}>
                  {row.map((c0, ci) => {
                    const c = cell(c0);
                    const a = c.a ?? b.a[col] ?? "l";
                    col += c.span ?? 1;
                    return <td key={ci} colSpan={c.span} style={{ border: "1px solid #ded8c8", padding: "4px 5px", textAlign: a === "r" ? "right" : a === "c" ? "center" : "left", fontWeight: c.b ? 700 : 400, background: bgOf(c.bg), wordBreak: "break-word", whiteSpace: "pre-line" }}>{c.t}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  if (b.k === "words") return <div style={{ marginTop: 10, fontSize: 11 }}><b style={{ fontSize: 8, letterSpacing: 1 }}>AMOUNT IN WORDS: </b>{b.v}</div>;
  if (b.k === "text") return <div style={{ marginTop: 12, fontSize: 11 }}><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "#777", textTransform: "uppercase" }}>{b.l}</div><div style={{ whiteSpace: "pre-line", marginTop: 2 }}>{b.v}</div></div>;
  return <div style={{ marginTop: b.gap ?? 8, fontSize: 12, lineHeight: 1.55, whiteSpace: "pre-line", fontWeight: b.b ? 700 : 400 }}>{b.v}</div>;
}

export function Paper({ view }: { view: View }) {
  const W = view.landscape ? 1123 : 794;
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [h, setH] = useState(1000);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const letter = view.letter;
  return (
    <div ref={box} style={{ width: "100%", height: h * scale }} className="overflow-hidden">
      <div ref={inner} style={{ width: W, transform: `scale(${scale})`, transformOrigin: "top left", background: "#fff", color: "#111", padding: letter ? "56px 64px" : "38px 40px", minHeight: view.landscape ? 794 : 1123, fontFamily: "Helvetica, Arial, sans-serif", boxShadow: "0 1px 0 #e6e1d4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, borderBottom: "2px solid #0b1020", paddingBottom: 12 }}>
          <div style={{ maxWidth: "58%" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{view.co.name || "Your company name"}</div>
            {view.co.address && <div style={{ fontSize: 10.5, color: "#555", marginTop: 3 }}>{view.co.address}</div>}
            <div style={{ fontSize: 10.5, color: "#555" }}>{[view.co.phone, view.co.email, view.co.website].filter(Boolean).join("   |   ")}</div>
            <div style={{ fontSize: 10.5, color: "#555" }}>{[view.co.gstin && `GSTIN ${view.co.gstin}`, view.co.iec && `IEC ${view.co.iec}`, view.co.pan && `PAN ${view.co.pan}`].filter(Boolean).join("   |   ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.2, color: "#0b1020" }}>{view.heading}</div>
            {view.meta.filter(([, v]) => v).map(([l, v]) => (
              <div key={l} style={{ fontSize: 11, marginTop: 3 }}><span style={{ color: "#777", fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase" }}>{l}: </span><b>{v}</b></div>
            ))}
          </div>
        </div>
        {view.strip.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 22px", marginTop: 8, fontSize: 10.5, color: "#444" }}>
            {view.strip.map(([l, v]) => <span key={l}><span style={{ color: "#888" }}>{l}: </span><b>{v}</b></span>)}
          </div>
        )}
        {view.blocks.map((b, i) => <BlockView key={i} b={b} />)}
        {view.bank && (
          <div style={{ marginTop: 18, borderTop: "1px solid #cfc8b6", paddingTop: 8, fontSize: 10, color: "#444" }}>
            <b style={{ letterSpacing: 1, fontSize: 8.5 }}>BANK DETAILS  </b>
            {view.bank.map(([l, v]) => `${l}: ${v}`).join("   |   ")}
          </div>
        )}
        <div style={{ marginTop: 22, fontSize: 8.5, color: "#999", textAlign: "center" }}>Prepared with IMPEXIO — Global Trade Simplified</div>
      </div>
    </div>
  );
}
