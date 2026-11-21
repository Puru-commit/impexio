import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { CtaBand, Gradient, PageHero, SectionHead } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";
import { TradeFinder } from "@/components/site/trade-finder";
import { BadgeCheck, Compass, Mail, Search } from "lucide-react";

export function TradePage({ role }: { role: "buyers" | "sellers" }) {
  const buyers = role === "buyers";
  const steps = [
    { icon: Compass, title: "Start anywhere", text: buyers ? "Pick a sector or a country. You do not need a product to begin." : "Pick a sector or a country. You do not need to know what to buy yet." },
    { icon: Search, title: buyers ? "Browse buyers" : "Browse sellers", text: buyers ? "See businesses that import what you make, with their country and the products they buy." : "See suppliers and manufacturers, with their location and what they offer." },
    { icon: BadgeCheck, title: "Check before you trust", text: "Look at the details and verify a company yourself before any deal." },
    { icon: Mail, title: "Reach out", text: buyers ? "Send a buyer introduction letter from IMPEXIO in a few clicks." : "Send an enquiry letter from IMPEXIO in a few clicks." },
  ];
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow={buyers ? "Buyers" : "Sellers"}
          title={buyers ? <>Find buyers <Gradient>for what you make.</Gradient></> : <>Find sellers <Gradient>you can trust.</Gradient></>}
          text={buyers ? "Looking for customers abroad? Start with a sector or a country and discover who is buying, even if you have not picked a product." : "Looking for suppliers? Start with a sector or a country and discover who sells, even if you have not decided what to source."}
        />
        <section className="bg-paper pb-20">
          <div className="mx-auto max-w-4xl px-5"><TradeFinder role={role} /></div>
        </section>
        <section className="bg-[#ece6d6] py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow="How it works" title="Four simple steps" />
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.07} className="h-full">
                    <div className="h-full rounded-2xl border border-border bg-white p-6">
                      <div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-ink text-brass-light"><s.icon className="size-5" /></span><span className="font-mono text-xs text-[#9a6f1f]">0{i + 1}</span></div>
                      <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <CtaBand title={buyers ? "Your next buyer is one search away." : "Your next supplier is one search away."} text="Create a free account to start." />
      </main>
      <Footer />
    </>
  );
}
