import { searchHs } from "@/lib/hs-search";

// Public search for the home page. Short results and a simple per-visitor limit.
const hits = new Map<string, number[]>();
const WINDOW = 60_000;
const MAX_PER_WINDOW = 30;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

export async function GET(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return Response.json({ ok: false, rows: [], message: "Too many searches. Please wait a minute." }, { status: 429 });
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const r = await searchHs(q, 8);
  return Response.json(r, { headers: { "Cache-Control": "no-store" } });
}
