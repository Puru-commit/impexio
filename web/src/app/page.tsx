import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
        <Image
          src="/impexio-logo.png"
          alt="IMPEXIO — Global Trade Simplified"
          width={1536}
          height={1024}
          priority
          className="h-auto w-72"
        />
        <h1 className="text-4xl font-semibold md:text-6xl">
          Trade Beyond Borders. Without the Complexity.
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          HS 8471.30 · USD 24,500.00
        </p>
      </section>

      <section className="dark bg-background px-6 py-16 text-center text-foreground">
        <h2 className="text-3xl">Harbour Ink section</h2>
        <p className="mt-2 text-brass-light">Route Brass accent</p>
      </section>
    </main>
  );
}