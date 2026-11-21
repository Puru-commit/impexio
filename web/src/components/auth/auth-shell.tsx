import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

export function AuthShell({ title, text, points, children }: { title: string; text: string; points: string[]; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      {/* brand side */}
      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:block">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-brass/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 size-[420px] rounded-full bg-signal/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <svg aria-hidden viewBox="0 0 400 300" className="absolute bottom-0 left-0 w-full opacity-70">
          <path id="a1" d="M30 260 Q 140 60 260 150 T 380 40" fill="none" stroke="#e8b94f" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 6"><animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.6s" repeatCount="indefinite" /></path>
          <path id="a2" d="M30 260 Q 200 280 360 200" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 6"><animate attributeName="stroke-dashoffset" from="0" to="-22" dur="2s" repeatCount="indefinite" /></path>
          <circle r="4" fill="#e8b94f"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#a1" /></animateMotion></circle>
          <circle r="3.5" fill="#fff"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#a2" /></animateMotion></circle>
          <circle cx="30" cy="260" r="6" fill="#e8b94f" />
        </svg>
        <div className="relative flex h-full flex-col justify-center p-14">
          <h2 className="max-w-md text-4xl font-semibold leading-tight">{title}</h2>
          <p className="mt-4 max-w-md text-lg text-paper/70">{text}</p>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3"><span className="flex size-6 items-center justify-center rounded-full bg-brass-light text-ink"><Check className="size-3.5" /></span>{p}</li>
            ))}
          </ul>
        </div>
      </aside>

      {/* form side */}
      <section className="relative flex items-center justify-center overflow-hidden bg-paper px-5 py-12">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 size-[420px] rounded-full bg-brass/20 blur-3xl" />
        <div className="relative w-full max-w-lg">
          <Link href="/" className="mx-auto block w-fit"><Image src="/impexio-logo.png" alt="IMPEXIO — Global Trade Simplified" width={1075} height={793} priority className="h-24 w-auto" /></Link>
          {children}
        </div>
      </section>
    </main>
  );
}
