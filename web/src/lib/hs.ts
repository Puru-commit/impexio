/** 8 digits -> 1006.30.20, 6 -> 1006.30, 4 -> 1006 */
export function fmtHs(code: string) {
  const d = code.replace(/\D/g, "");
  if (d.length >= 8) return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
  if (d.length >= 6) return `${d.slice(0, 4)}.${d.slice(4, 6)}`;
  return d;
}
export type HsHit = { code: string; level: number; desc: string; heading: string; context: string };
