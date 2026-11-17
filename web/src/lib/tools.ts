import {
  Box,
  Calculator,
  Container,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Filter,
  Mail,
  Megaphone,
  PackageCheck,
  Receipt,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  slug: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

export type ToolGroup = {
  id: string;
  title: string;
  intro: string;
  tools: Tool[];
};

// Single source of truth: the Features page, the tool pages and (later)
// the app sidebar all read from this list.
export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "export",
    title: "Export",
    intro: "Costing, calculators and documents for your outgoing shipments.",
    tools: [
      { slug: "cbm-calculation", title: "CBM Calculation", text: "Work out the cubic volume of your cartons and shipment.", icon: Box },
      { slug: "container-expenses-fob", title: "Container Expenses FOB", text: "List the container and FOB expenses for a shipment.", icon: Container },
      { slug: "export-costing", title: "Export Costing", text: "Build the cost and price of an export order.", icon: Calculator },
      { slug: "export-costing-2", title: "Export Costing 2", text: "A second costing format for a different way of pricing.", icon: FileSpreadsheet },
      { slug: "export-data-filter-format", title: "Export Data Filter Format", text: "Organise and filter your export data in a clean format.", icon: Filter },
      { slug: "export-proforma-invoice", title: "Export Proforma Invoice", text: "Create a proforma invoice to send to your buyer.", icon: Receipt },
      { slug: "export-quotation", title: "Export Quotation", text: "Prepare a professional quotation for a buyer.", icon: FileSignature },
      { slug: "export-sample-courier-invoice", title: "Export Sample Courier Invoice", text: "An invoice for samples sent by courier.", icon: PackageCheck },
    ],
  },
  {
    id: "import",
    title: "Import",
    intro: "Letters and orders for the goods you bring in.",
    tools: [
      { slug: "import-letter-for-inquiry", title: "Import Letter for Inquiry", text: "Write an inquiry letter to a supplier.", icon: Mail },
      { slug: "import-purchase-order", title: "Import Purchase Order", text: "Create a purchase order for your supplier.", icon: ShoppingCart },
    ],
  },
  {
    id: "exim-marketing",
    title: "EXIM Marketing",
    intro: "Reach new buyers and keep the conversation going.",
    tools: [
      { slug: "export-follow-up-mail", title: "Export Follow Up Mail", text: "A follow-up mail for buyers who have not replied.", icon: FileText },
      { slug: "export-marketing-buyers-intro-letter", title: "Export Marketing (Buyers Intro Letter)", text: "Introduce your company and products to new buyers.", icon: Megaphone },
    ],
  },
];

export const ALL_TOOLS: Tool[] = TOOL_GROUPS.flatMap((g) => g.tools);

export function findTool(slug: string) {
  for (const g of TOOL_GROUPS) {
    const tool = g.tools.find((t) => t.slug === slug);
    if (tool) return { tool, group: g };
  }
  return null;
}
