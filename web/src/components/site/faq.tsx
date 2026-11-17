import Link from "next/link";
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
    q: "Which tools and documents are included?",
    a: "Export: CBM Calculation, Container Expenses FOB, Export Costing, Export Costing 2, Export Data Filter Format, Export Proforma Invoice, Export Quotation and Export Sample Courier Invoice. Import: Import Letter for Inquiry and Import Purchase Order. EXIM Marketing: Export Follow Up Mail and Export Marketing (Buyers Intro Letter).",
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
      className="relative overflow-hidden bg-paper text-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-signal/10 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-24 pt-16 md:grid-cols-[1fr_1.6fr] md:pb-32 md:pt-20">
        <div className="self-start md:sticky md:top-32">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">
            <span className="size-1.5 rounded-full bg-brass" />
            FAQ
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">
            Questions,{" "}
            <span className="bg-gradient-to-r from-primary to-signal bg-clip-text text-transparent">
              answered plainly.
            </span>
          </h2>
          <p className="mt-5 max-w-sm text-muted-foreground">
            Cannot find what you are looking for? Send us a message and we will
            help.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all hover:bg-primary active:scale-[0.98]"
          >
            Contact us
          </Link>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="group rounded-2xl border border-border bg-white/70 px-6 py-5 backdrop-blur-sm transition-all duration-300 open:bg-white open:shadow-[0_20px_40px_-28px_rgba(11,16,32,0.35)] hover:border-brass/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-brass-light transition-transform duration-300 group-open:rotate-45">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
