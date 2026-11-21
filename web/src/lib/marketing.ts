import {
  Anchor, Award, BadgeCheck, Banknote, Box, Calculator, Container, FileCheck2, FileSignature,
  FileText, Globe2, Landmark, Package, PackageCheck, Plane, Receipt, ScrollText, Search,
  ShieldCheck, Ship, Stamp, Truck, Waves, Scale, Percent, Factory, Warehouse, Megaphone,
  ClipboardCheck, ShoppingCart, Boxes, Coins, Ruler, type LucideIcon,
} from "lucide-react";

export type Item = { title: string; text: string; icon: LucideIcon; tag?: string };

/* ------------------------------------------------------------------ EXIM Master */
export const COST_TERMS = [
  { code: "EXW", name: "Ex Works" },
  { code: "FCA", name: "Free Carrier" },
  { code: "FOB", name: "Free On Board" },
  { code: "CFR", name: "Cost and Freight (CNF)" },
  { code: "CIF", name: "Cost, Insurance, Freight" },
  { code: "CPT", name: "Carriage Paid To" },
  { code: "DAP", name: "Delivered At Place" },
  { code: "DDP", name: "Delivered Duty Paid" },
];

export const EXIM_TOOLS: (Item & { href: string; main?: boolean })[] = [
  { title: "Export Quotation", text: "Send a clean, professional quotation with price terms, validity and payment terms in minutes.", icon: FileSignature, href: "/exim-master#quotation" },
  { title: "Export Cost Calculator", text: "Work out your price under FOB, CIF, CFR (CNF), EXW, FCA, CPT, DAP and DDP, then see your margin.", icon: Calculator, href: "/exim-master#cost", main: true },
  { title: "Sea Port Finder", text: "Find the port you need: name, country, UN/LOCODE and what it handles.", icon: Anchor, href: "/exim-master#ports" },
  { title: "HS Code Finder", text: "Search HS codes by product name or by code. Free, with no sign-up.", icon: Search, href: "/hs-code-finder" },
  { title: "CBM Calculator", text: "Cubic metres of your cartons and whole shipment, with total weight.", icon: Box, href: "/exim-master#more" },
  { title: "Container Load Planner", text: "Estimate how many cartons fit in a 20 ft, 40 ft or 40 ft HC container.", icon: Container, href: "/exim-master#more" },
  { title: "Profit Margin Calculator", text: "Know your real margin after freight, duties, incentives and bank charges.", icon: Percent, href: "/exim-master#more" },
  { title: "Currency and Unit Converter", text: "Convert currencies, kilograms, pounds, feet and metres while you quote.", icon: Ruler, href: "/exim-master#more" },
  { title: "Incoterms Guide", text: "Who pays, who carries the risk and where it passes, explained for each term.", icon: ScrollText, href: "/exim-master#more" },
];

/* ------------------------------------------------------------------ Export */
export type Step = { title: string; text: string; icon: LucideIcon; docs: string[] };

export const EXPORT_STEPS: Step[] = [
  { title: "Get set up", text: "Register your business, get an Importer-Exporter Code (IEC), open a current account that can take foreign payments and get an Authorised Dealer bank code.", icon: BadgeCheck, docs: ["IEC", "GST registration", "AD code registered with customs"] },
  { title: "Find the product and buyer", text: "Classify your product with the right HS code, check which markets want it and agree the price.", icon: Search, docs: ["HS code", "Quotation", "Proforma invoice"] },
  { title: "Confirm the order", text: "The buyer accepts your terms. Payment is secured by advance, letter of credit or another agreed method.", icon: FileSignature, docs: ["Proforma invoice", "Letter of credit"] },
  { title: "Make and pack", text: "Produce the goods, test quality where required and pack them for the voyage.", icon: PackageCheck, docs: ["Packing list", "Inspection / quality certificate"] },
  { title: "Book the shipment", text: "Book space with a shipping line or airline, usually through a freight forwarder, and insure the cargo.", icon: Ship, docs: ["Booking confirmation", "Insurance policy"] },
  { title: "Clear customs", text: "File the shipping bill, get the goods examined and receive the let export order.", icon: Stamp, docs: ["Shipping bill", "Commercial invoice", "Packing list"] },
  { title: "Ship and collect payment", text: "The carrier issues the transport document. You send the document set to the buyer or bank and receive payment.", icon: Banknote, docs: ["Bill of lading / Airway bill", "Certificate of origin", "BRC", "Bill of exchange"] },
  { title: "Claim your benefits", text: "After shipment, claim the schemes you qualify for, such as RoDTEP, duty drawback and GST refund.", icon: Landmark, docs: ["Shipping bill", "BRC", "Export invoice"] },
];

export const EXPORT_DOCS: (Item & { slug?: string })[] = [
  { title: "Proforma Invoice", text: "The advance price offer. The buyer uses it to approve the order, arrange payment or open a letter of credit.", icon: FileText, tag: "Before the order", slug: "proforma-invoice" },
  { title: "Commercial Invoice", text: "The main bill for the goods. Customs, banks and the buyer all rely on it.", icon: Receipt, tag: "At shipment" },
  { title: "Packing List", text: "What is in every carton: quantity, weights and dimensions. Customs and the carrier use it to check the cargo.", icon: Package, tag: "At shipment" },
  { title: "Shipping Bill", text: "The customs declaration filed to export goods from India. It is also the base for incentive claims.", icon: Stamp, tag: "Customs" },
  { title: "Bill of Lading", text: "Issued by the shipping line for sea cargo. It is the receipt, the contract of carriage and the title to the goods.", icon: Ship, tag: "Sea cargo" },
  { title: "Airway Bill", text: "The transport document for air cargo. It is a receipt and contract, but not a document of title.", icon: Plane, tag: "Air cargo" },
  { title: "Certificate of Origin", text: "Proves where the goods were made. Many buyers need it for customs clearance and for duty preferences under trade agreements.", icon: Globe2, tag: "Origin" },
  { title: "Insurance Policy", text: "Covers loss or damage in transit. It is required under CIF and CIP terms and wise under every other.", icon: ShieldCheck, tag: "Cover" },
  { title: "Letter of Credit", text: "A bank's promise to pay you when you present the right documents. It is the safest way to get paid by a new buyer.", icon: Landmark, tag: "Payment" },
  { title: "BRC (Bank Realisation Certificate)", text: "Issued by your bank to show the export money has arrived. You need it for incentive claims and GST refund.", icon: BadgeCheck, tag: "After payment" },
  { title: "Inspection, Health or Quality Certificate", text: "Confirms the goods meet the required standard. Food, plants, animal products and many others need one.", icon: ClipboardCheck, tag: "Quality" },
  { title: "Bill of Exchange", text: "A written order to pay a fixed sum on demand or on a set date, used in collection-based payment terms.", icon: Scale, tag: "Payment" },
];

/* ------------------------------------------------------------------ Import */
export const IMPORT_STEPS: Step[] = [
  { title: "Get set up", text: "An Importer-Exporter Code (IEC) is needed for most commercial imports. Register on the customs system and know your product's rules.", icon: BadgeCheck, docs: ["IEC", "GST registration", "Customs registration"] },
  { title: "Check if it can be imported", text: "Find the HS code, check the duty rate and see whether the item is free, restricted or prohibited.", icon: Search, docs: ["HS code", "Import policy status", "Special approvals"] },
  { title: "Order from the supplier", text: "Agree price and terms, issue the order and arrange payment by letter of credit or another method.", icon: ShoppingCart, docs: ["Purchase order", "Letter of credit"] },
  { title: "Supplier ships", text: "The supplier prepares the goods and the shipping documents, and you insure the cargo.", icon: Ship, docs: ["Commercial invoice", "Packing list", "Insurance certificate"] },
  { title: "Goods are in transit", text: "The carrier moves the cargo and issues the transport document. Documents go to you or your bank.", icon: Waves, docs: ["Bill of lading / Airway bill", "Certificate of origin"] },
  { title: "File the Bill of Entry", text: "Before or on arrival, file the Bill of Entry against the vessel's Import General Manifest (IGM). Customs assesses duty and may examine the goods.", icon: Stamp, docs: ["Bill of entry (IGM)", "Invoice", "Packing list", "Bill of lading"] },
  { title: "Pay duty and clear", text: "Pay customs duty and IGST, get the out-of-charge order and release the goods from the port.", icon: Banknote, docs: ["Duty payment challan", "Out of charge"] },
  { title: "Deliver and keep records", text: "Move the goods to your premises, claim input tax credit where eligible and keep records for audit.", icon: Truck, docs: ["Bill of entry", "GST ITC records"] },
];

export const IMPORT_DOCS: (Item & { sameAs?: string })[] = [
  { title: "Purchase Order", text: "Your formal order to the supplier: items, quantity, price, delivery and terms.", icon: ShoppingCart, tag: "Buyer issues" },
  { title: "Commercial Invoice", text: "The supplier's bill for the goods. Customs uses its value to work out duty.", icon: Receipt, tag: "Supplier issues", sameAs: "On import, the buyer checks it against the order and uses it to file the Bill of Entry." },
  { title: "Packing List", text: "Carton-by-carton contents, weights and sizes, used to check the cargo on arrival.", icon: Package, tag: "Supplier issues", sameAs: "On import, you use it for customs examination and port clearance." },
  { title: "Letter of Credit", text: "Your bank's promise to pay the supplier once the right documents are presented.", icon: Landmark, tag: "Buyer's bank", sameAs: "On import, you are the one who applies for it and your bank issues it." },
  { title: "Bill of Lading", text: "The carrier's receipt and document of title for sea cargo. You need the original to take delivery.", icon: Ship, tag: "Carrier issues", sameAs: "On import, you present it to the shipping line to get the delivery order." },
  { title: "Certificate of Origin", text: "Shows the country where goods were made. It can unlock lower duty under a trade agreement.", icon: Globe2, tag: "Origin", sameAs: "On import, you submit it to customs to claim a preferential rate." },
  { title: "Insurance Certificate", text: "Proof that the cargo is insured while in transit.", icon: ShieldCheck, tag: "Cover", sameAs: "On import, you or your supplier arranges it depending on the price term." },
  { title: "Bill of Entry (IGM)", text: "The import declaration filed with Indian customs, matched to the vessel's Import General Manifest.", icon: Stamp, tag: "Customs" },
  { title: "Special Approvals", text: "Licences and clearances some goods need: for example from the BIS, FSSAI, drug controller or plant and animal quarantine.", icon: Award, tag: "If your goods need them" },
];

/* ------------------------------------------------------------------ Export incentives */
export type Scheme = {
  id: string;
  name: string;
  full: string;
  icon: LucideIcon;
  short: string;
  what: string;
  who: string;
  benefit: string[];
  how: string[];
  watch: string;
  source: { label: string; href: string };
  goals: string[];
};

export const INCENTIVES_AS_OF = "November 2026";

export const SCHEMES: Scheme[] = [
  {
    id: "rodtep", name: "RoDTEP", full: "Remission of Duties and Taxes on Exported Products", icon: Percent,
    short: "Get back the hidden taxes inside your exported product.",
    what: "RoDTEP refunds central, state and local duties and taxes that are built into the cost of an exported product and are not refunded in any other way, such as fuel, electricity and mandi tax.",
    who: "Manufacturer and merchant exporters whose product HS codes are covered by the notified RoDTEP rate list.",
    benefit: ["Reduces your cost, so you can quote a sharper price", "Credit is given as a transferable electronic scrip that can pay certain customs duties", "Claimed through the shipping bill, so there is no separate application per shipment"],
    how: ["Find your product's HS code", "Check whether it is in the notified rate list and what rate and cap apply", "Declare the claim on the shipping bill", "Track the scrip once it is issued"],
    watch: "The rate depends on the exact HS code and can have a value cap. It is changed by notification, so always check the current list and its effective date.",
    source: { label: "DGFT and CBIC", href: "https://www.dgft.gov.in" },
    goals: ["refund", "tax", "all"],
  },
  {
    id: "rosctl", name: "RoSCTL", full: "Rebate of State and Central Taxes and Levies", icon: Factory,
    short: "A tax rebate made for garments and made-ups.",
    what: "RoSCTL rebates the state and central taxes and levies embedded in exported apparel, garments and made-ups that are not refunded elsewhere. It is run under the Ministry of Textiles.",
    who: "Exporters of apparel, garments and made-up textile products covered by the notified rate list.",
    benefit: ["Lowers the tax cost inside your garment price", "Credit is issued as a transferable scrip", "Claimed through the shipping bill"],
    how: ["Confirm your product is covered", "Look up the rate for your HS code", "Declare the claim on the shipping bill", "Collect the scrip after the claim is processed"],
    watch: "This is a temporary scheme. Its validity is extended by notification, so check the end date before you quote. It is meant to replace, not add to, the same taxes under RoDTEP.",
    source: { label: "Ministry of Textiles and DGFT", href: "https://texmin.nic.in" },
    goals: ["garment", "refund", "textile"],
  },
  {
    id: "drawback", name: "Duty Drawback", full: "Customs and Central Excise Duty Drawback", icon: Coins,
    short: "Refund of duty paid on the materials used in your export.",
    what: "Duty Drawback refunds customs duty paid on imported inputs and central taxes on materials used to make the exported goods. It is claimed at an All Industry Rate (AIR) or, if your actual duty is higher, as a Brand Rate.",
    who: "Exporters whose inputs carry duty, with the product covered by the AIR schedule or approved for a Brand Rate.",
    benefit: ["Money back on duty you have already paid", "A fixed AIR makes the claim simple", "A Brand Rate fits you if your real duty is higher than the AIR"],
    how: ["Check the AIR for your tariff item", "Declare the drawback claim on the shipping bill", "Keep your invoices and shipment proof", "For a Brand Rate, apply with your input and output details"],
    watch: "The same duty cannot be claimed twice. Read the notification conditions before you combine Duty Drawback with other schemes. Rates and caps change by notification.",
    source: { label: "CBIC", href: "https://www.cbic.gov.in" },
    goals: ["refund", "inputs", "all"],
  },
  {
    id: "gst", name: "GST", full: "GST on Exports (Zero-rated supply)", icon: Receipt,
    short: "Export without paying GST, or get it back.",
    what: "Exports are zero-rated under GST. You can export under a Letter of Undertaking (LUT) without paying IGST, or pay IGST and claim a refund. Input tax credit on your purchases is also refundable.",
    who: "Every registered exporter of goods or services.",
    benefit: ["Your working capital is not locked in GST", "No tax cost built into your export price", "Refund of unused input tax credit"],
    how: ["Choose the LUT route or the pay-and-refund route", "File the LUT once for the financial year", "Report the export in your GST returns", "Apply for a refund with your shipping bill and BRC details"],
    watch: "Refund conditions, time limits and forms are set by the GST law and its notifications. Check the current ones on the official portal.",
    source: { label: "CBIC (GST)", href: "https://www.cbic.gov.in" },
    goals: ["tax", "refund", "all"],
  },
  {
    id: "aa", name: "Advance Authorisation", full: "Advance Authorisation Scheme", icon: FileCheck2,
    short: "Import your raw material duty free, then export the product.",
    what: "Advance Authorisation lets you import inputs that are physically incorporated in your export product without paying basic customs duty (and, subject to conditions, other duties), against an export obligation.",
    who: "Manufacturer exporters, and merchant exporters tied to a supporting manufacturer.",
    benefit: ["Saves import duty on raw material", "Makes your export price more competitive", "Inputs allowed are set by standard input-output norms (SION) or your own norms"],
    how: ["Check the input-output norm for your product", "Apply to DGFT for the authorisation", "Import the inputs duty free", "Fulfil the export obligation and file for redemption"],
    watch: "You must complete the export obligation within the period stated on the authorisation. Missing it can mean paying duty with interest.",
    source: { label: "DGFT (Foreign Trade Policy)", href: "https://www.dgft.gov.in" },
    goals: ["inputs", "duty-free", "all"],
  },
  {
    id: "epcg", name: "EPCG", full: "Export Promotion Capital Goods Scheme", icon: Factory,
    short: "Buy machinery for your factory at zero customs duty.",
    what: "EPCG lets you import capital goods for production at zero customs duty, in return for an export obligation linked to the duty saved.",
    who: "Manufacturer exporters, merchant exporters tied to a supporting manufacturer, and some service providers.",
    benefit: ["Lower cost to set up or upgrade your plant", "Better equipment lets you make more and better products", "One authorisation can cover a list of machines"],
    how: ["List the capital goods you need", "Apply to DGFT for the authorisation", "Import the machinery at zero duty", "Meet the export obligation and apply for fulfilment"],
    watch: "The export obligation and its time limit are set in the Foreign Trade Policy and Handbook of Procedures. Read the current ones before you apply.",
    source: { label: "DGFT (Foreign Trade Policy)", href: "https://www.dgft.gov.in" },
    goals: ["machinery", "duty-free"],
  },
  {
    id: "moowr", name: "MOOWR", full: "Manufacture and Other Operations in Warehouse Regulations", icon: Warehouse,
    short: "Manufacture in a bonded warehouse and defer the duty.",
    what: "Under MOOWR you can manufacture, process or do other operations inside a customs-bonded warehouse. Import duty on inputs and machinery is deferred until the goods are cleared into India. Goods exported from the warehouse do not attract the duty.",
    who: "Manufacturers who import inputs or machinery and export most of their output.",
    benefit: ["Better cash flow, because duty is not paid up front", "No duty on goods you export from the unit", "Works alongside your normal operations"],
    how: ["Check whether your unit and goods qualify", "Apply to customs for warehouse licence and permission", "Bring in inputs and machinery under bond", "Keep the bond records customs asks for"],
    watch: "Compliance is stricter than normal. Records, bonds and customs supervision apply, so plan for the paperwork.",
    source: { label: "CBIC (Customs)", href: "https://www.cbic.gov.in" },
    goals: ["inputs", "duty-free", "machinery"],
  },
  {
    id: "mai", name: "MAI", full: "Market Access Initiative", icon: Megaphone,
    short: "Support to promote Indian products in new markets.",
    what: "The Market Access Initiative gives financial support for export promotion activities abroad, such as trade fairs, buyer-seller meets, market studies and branding.",
    who: "Mostly export promotion councils, industry associations and similar bodies that run the activity, so exporters usually benefit by taking part in these programmes.",
    benefit: ["Lower cost to meet buyers abroad", "Access to organised fairs and delegations", "Market studies that help you choose where to sell"],
    how: ["See which council or association covers your product", "Watch for their MAI-backed programmes", "Register for the event", "Keep your participation proof"],
    watch: "Eligibility and support level depend on the activity and the sponsoring agency. Confirm the terms with the organiser.",
    source: { label: "Department of Commerce", href: "https://commerce.gov.in" },
    goals: ["marketing", "fairs"],
  },
];

export const GOALS = [
  { id: "refund", label: "Get tax or duty refunded" },
  { id: "garment", label: "I export garments" },
  { id: "inputs", label: "Import raw material" },
  { id: "machinery", label: "Buy machinery" },
  { id: "marketing", label: "Find buyers abroad" },
];

export const DATA_PRINCIPLES = [
  { title: "Primary sources only", text: "CBIC, DGFT, the Ministry of Textiles and the destination country's own tariff authority." },
  { title: "No data beats unsourced data", text: "Where there is no official source we show nothing, or label the figure as an estimate." },
  { title: "The date is part of the answer", text: "Every page lists its sources with an as-of date. Temporary notifications show their end date." },
  { title: "Statutory is not applied", text: "Where an exemption, trade agreement or end-use condition can lower a rate, we say so instead of showing one final number." },
];

/* ------------------------------------------------------------------ Buyers & sellers */
export const TRADE_SECTORS = [
  "Agriculture and food", "Textiles and garments", "Chemicals", "Engineering goods", "Electronics",
  "Leather and footwear", "Gems and jewellery", "Handicrafts and home", "Pharma and health", "Plastics", "Marine products", "Building materials",
];
export const TRADE_COUNTRIES = ["USA", "UAE", "United Kingdom", "Germany", "Netherlands", "Saudi Arabia", "Singapore", "Australia", "Japan", "Bangladesh"];

/* ------------------------------------------------------------------ Pricing */
export type Plan = {
  id: string; name: string; price: string; per: string; note: string; badge?: string;
  cta: string; features: string[]; highlight?: boolean; icon: LucideIcon;
};

export const PLANS: Plan[] = [
  {
    id: "free", name: "Free trial", price: "₹0", per: "to start", icon: Boxes,
    note: "Try IMPEXIO with no card.",
    features: ["AI HS Code Finder", "1 free document generation", "Export incentives guide", "Not all tools are included"],
    cta: "Start free",
  },
  {
    id: "monthly", name: "Monthly", price: "₹499", per: "per month", icon: Ship,
    note: "Everything, for one month.",
    features: ["Every document and tool in every module", "EXIM Master, Export, Import", "Buyers and sellers", "Export incentives tools", "Print-ready PDF export"],
    cta: "Get Monthly",
  },
  {
    id: "yearly", name: "Yearly", price: "₹4,999", per: "per year", icon: Award, highlight: true, badge: "2 months free",
    note: "₹5,988 if paid monthly. You save ₹989, about 2 months free.",
    features: ["Everything in Monthly", "Full access for 12 months", "Priority support", "Best for steady exporters and importers"],
    cta: "Get Yearly",
  },
  {
    id: "lifetime", name: "Lifetime", price: "₹9,999", per: "one time", icon: BadgeCheck, badge: "Pay once",
    note: "One payment. Use IMPEXIO for as long as it runs.",
    features: ["Everything in Yearly", "No renewals, ever", "All future tools included", "Priority support"],
    cta: "Get Lifetime",
  },
];

export const FAQ_PRICING = [
  { q: "What do I get on the free trial?", a: "The AI HS Code Finder and one free document generation. The other tools unlock on a paid plan." },
  { q: "Is the yearly plan really two months free?", a: "Twelve months at ₹499 is ₹5,988. The yearly plan is ₹4,999, which saves ₹989, roughly two months." },
  { q: "What does Lifetime mean?", a: "You pay once and keep access for as long as IMPEXIO is offered, including new tools we add." },
  { q: "Can I switch plans later?", a: "Yes. Start free or monthly and move to yearly or Lifetime whenever you like." },
];

