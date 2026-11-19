import { renderToBuffer } from "@react-pdf/renderer";
import { buildView } from "@/lib/doc/core";
import { TOOL_DEFS } from "@/lib/doc/defs";
import { DocPdf } from "@/lib/doc/pdf";
import { getDocument } from "@/lib/documents";
import { currentUserId } from "@/lib/session";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await currentUserId();
  if (!userId) return new Response("Please log in.", { status: 401 });

  const { id } = await ctx.params;
  const docId = Number(id);
  if (!Number.isInteger(docId) || docId < 1) return new Response("Not found", { status: 404 });

  const doc = await getDocument(userId, docId);
  const def = doc && TOOL_DEFS[doc.docType];
  if (!doc || !def) return new Response("Not found", { status: 404 });
  // The PDF is only available once the document is final.
  if (doc.status !== "final") return new Response("Finalise the document first.", { status: 403 });

  const buffer = await renderToBuffer(<DocPdf view={buildView(def, doc.data)} title={doc.title} />);
  const name = (doc.refNo || `${doc.docType}-${docId}`).replace(/[^A-Za-z0-9_-]/g, "_");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
