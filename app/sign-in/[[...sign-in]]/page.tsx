import type { Metadata } from "next";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Sign in — Marketspace" };

export default function SignInPage() {
  return (
    <ComingSoon
      title="Sign in coming soon"
      description="Account sign-in is being built. This route is reserved for the sign-in flow."
    />
  );
}
