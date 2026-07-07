import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Contact — Marketspace" };

export default function ContactPage() {
  return (
    <ComingSoon
      title="Contact form coming soon"
      description="We're building a proper contact form. For now, this page is a placeholder."
    />
  );
}
