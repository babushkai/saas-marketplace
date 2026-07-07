import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Privacy Policy — Marketspace" };

export default function PrivacyPage() {
  return (
    <ComingSoon
      title="Privacy policy coming soon"
      description="Our privacy policy is being finalized alongside the rest of the product."
    />
  );
}
