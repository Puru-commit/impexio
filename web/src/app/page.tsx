import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Atmosphere } from "@/components/site/atmosphere";
import { Workflow } from "@/components/site/workflow";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Atmosphere />
        <Workflow />
      </main>
    </>
  );
}