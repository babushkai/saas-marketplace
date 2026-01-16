import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SaaSマーケット | 日本のSaaS・サービスを見つけよう",
  description:
    "日本発のSaaS製品・サービスを探せるマーケットプレイス。あなたのビジネスに最適なツールを見つけましょう。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Clerk is properly configured
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPubKey && !clerkPubKey.includes("placeholder") && !clerkPubKey.includes("xxx");

  const content = (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if properly configured
  if (isClerkConfigured) {
    return (
      <ClerkProvider localization={jaJP}>
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
