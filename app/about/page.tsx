import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "About — Marketspace" };

export default function AboutPage() {
  return (
    <ComingSoon
      title="Our story is coming soon"
      description="We're putting together the story of why we built Marketspace. In the meantime, say hello on the contact page."
    />
  );
}
