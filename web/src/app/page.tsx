import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Workflow } from "@/components/site/workflow";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Workflow />
      </main>
    </>
  );
}