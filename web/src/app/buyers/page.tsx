import type { Metadata } from "next";
import { TradePage } from "@/components/site/trade-page";

export const metadata: Metadata = {
  title: "Buyers — IMPEXIO",
  description: "Start with a sector or a country, with no product needed.",
};

export default function Page() {
  return <TradePage role="buyers" />;
}
