import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Are IMPEXIO documents approved by customs or the government?",
    a: "No. IMPEXIO helps you prepare professional documents from the information you enter. They are not approved, certified or endorsed by any government or customs authority. Always confirm the requirements for your shipment with your customs broker or the relevant authority.",
  },
  {
    q: "How reliable are the AI HS Code suggestions?",
    a: "They are suggestions to help you start, shown with reasoning so you can check them. They are not guaranteed legal classifications. Verify the final code against the official tariff or with your customs broker before you use it.",
  },
  {
    q: "What do I get with the free trial?",
    a: "One free document, so you can see how IMPEXIO works before you decide to subscribe.",
  },
  {
    q: "How does billing work?",
    a: "The monthly plan is ₹249 per month, paid through Razorpay. You can manage or cancel your subscription from your account. Our Refund Policy explains the details.",
  },
  {
    q: "Which documents can I create?",
    a: "Proforma Invoice, Commercial Invoice, Packing List, Export Quotation, Export Costing Sheet, Purchase Order, Import Inquiry, Buyer Introduction Letter, Supplier Inquiry Letter and Export Follow-up Letter.",
  },
  {
    q: "Can other users see my data?",
    a: "No. Each account can only access its own documents, contacts and records.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="dark border-t border-border bg-background text-foreground"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1fr_1.6fr] md:py-32">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
            Questions, answered plainly.
          </h2>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus className="size-5 shrink-0 text-brass-light transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-2xl text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}