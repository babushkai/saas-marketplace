import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://saas-market.jp";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SaaSマーケット | 日本のSaaS・サービスを見つけよう",
    template: "%s | SaaSマーケット",
  },
  description:
    "日本発のSaaS製品・サービスを探せるマーケットプレイス。500以上のSaaSツールから、あなたのビジネスに最適なツールを見つけましょう。無料で比較・検討できます。",
  keywords: [
    "SaaS",
    "サース",
    "SaaS比較",
    "SaaSツール",
    "クラウドサービス",
    "ビジネスツール",
    "業務効率化",
    "DX",
    "デジタルトランスフォーメーション",
    "日本",
    "マーケットプレイス",
    "CRM",
    "マーケティングツール",
    "経理ソフト",
    "人事システム",
  ],
  authors: [{ name: "SaaSマーケット" }],
  creator: "SaaSマーケット",
  publisher: "SaaSマーケット",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: "SaaSマーケット",
    title: "SaaSマーケット | 日本のSaaS・サービスを見つけよう",
    description:
      "日本発のSaaS製品・サービスを探せるマーケットプレイス。500以上のSaaSツールから、あなたのビジネスに最適なツールを見つけましょう。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaSマーケット - 日本のSaaS・サービスを見つけよう",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSマーケット | 日本のSaaS・サービスを見つけよう",
    description:
      "日本発のSaaS製品・サービスを探せるマーケットプレイス。500以上のSaaSツールから、あなたのビジネスに最適なツールを見つけましょう。",
    images: ["/og-image.png"],
    creator: "@saas_market_jp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
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
