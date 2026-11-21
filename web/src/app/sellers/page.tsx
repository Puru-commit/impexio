import type { Metadata } from "next";
import { TradePage } from "@/components/site/trade-page";

export const metadata: Metadata = {
  title: "Sellers — IMPEXIO",
  description: "Start with a sector or a country, with no product needed.",
};

export default function Page() {
  return <TradePage role="sellers" />;
}
