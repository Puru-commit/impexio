import { renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "@/lib/documents";
import { InvoicePdf } from "@/lib/invoice-pdf";
import { sanitizeProforma } from "@/lib/proforma";
import { currentUserId } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await currentUserId();
  if (!userId) return new Response("Please log in.", { status: 401 });

  const { id } = await ctx.params;
  const docId = Number(id);
  if (!Number.isInteger(docId) || docId < 1) return new Response("Not found", { status: 404 });

  const doc = await getDocument(userId, docId);
  if (!doc || doc.docType !== "export-proforma-invoice") {
    return new Response("Not found", { status: 404 });
  }
  // The PDF is only available once the document is final. That is how the
  // free-document limit is enforced.
  if (doc.status !== "final") {
    return new Response("Finalise the document first.", { status: 403 });
  }

  const buffer = await renderToBuffer(<InvoicePdf d={sanitizeProforma(doc.data)} />);
  const name = `proforma-invoice-${docId}.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
