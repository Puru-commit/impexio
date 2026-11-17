import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Atmosphere } from "@/components/site/atmosphere";
import { Workflow } from "@/components/site/workflow";
import { Dawn, RouteDivider, WaveEdge } from "@/components/site/transitions";
import { Features } from "@/components/site/features";
import { ExportSection, ImportSection, HsCodeSection } from "@/components/site/trade-sections";
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
        <Dawn />
        <Features />
        <RouteDivider />
        <ExportSection />
        <WaveEdge from="#ece6d6" to="#f4f1ea" />
        <ImportSection />
        <Atmosphere compact />
        <HsCodeSection />
        <Dawn />
        <WaveEdge from="#f4f1ea" to="#ece6d6" />
        <Pricing />
        <WaveEdge from="#ece6d6" to="#f4f1ea" />
        <Faq />
        <Atmosphere compact />
      </main>
      <Footer />
    </>
  );
}
