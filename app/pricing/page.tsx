import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Pricing — Marketspace" };

export default function PricingPage() {
  return (
    <ComingSoon
      title="Full pricing details are on the way"
      description="We're finalizing plan details for buyers and sellers. Check back soon, or reach out and we'll walk you through it."
    />
  );
}
