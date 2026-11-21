import { searchHs } from "@/lib/hs-search";

// Public search for the HS Code Finder page. A simple per-visitor limit keeps the list from being bulk-copied.
const hits = new Map<string, number[]>();
const WINDOW = 60_000;
const MAX_PER_WINDOW = 60;

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
  if (limited(ip)) {
    return Response.json({ ok: false, rows: [], total: 0, page: 1, pages: 0, message: "Too many searches. Please wait a minute." }, { status: 429 });
  }
  const sp = new URL(req.url).searchParams;
  const r = await searchHs(sp.get("q") ?? "", Number(sp.get("page") ?? 1));
  return Response.json(r, { headers: { "Cache-Control": "no-store" } });
}
