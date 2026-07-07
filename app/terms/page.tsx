import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Terms of Service — Marketspace" };

export default function TermsPage() {
  return (
    <ComingSoon
      title="Terms of service coming soon"
      description="Our terms of service are being finalized alongside the rest of the product."
    />
  );
}
