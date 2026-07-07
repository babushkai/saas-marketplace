import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Sign up — Marketspace" };

export default function SignUpPage() {
  return (
    <ComingSoon
      title="Sign up coming soon"
      description="Account creation is being built. This route is reserved for the sign-up flow."
    />
  );
}
