import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Atmosphere } from "@/components/site/atmosphere";
import { Workflow } from "@/components/site/workflow";
import { Features } from "@/components/site/features";
import { Pricing } from "@/components/site/pricing";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Atmosphere />
        <Workflow />
        <Features />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}