# Next.js 14 + Supabase + Clerk で日本向けSaaSマーケットプレイスを作った話

## はじめに

こんにちは、[@emi_ndk](https://qiita.com/emi_ndk)です。

普段はMLOpsやデータ基盤の仕事をしていますが、サイドプロジェクトとして**日本のSaaS製品を探せるマーケットプレイス「SaaSマーケット」**を開発しました。

本記事では、技術選定から実装のポイント、SEO対策まで、実際の開発で得た知見を共有します。

## 作ったもの

**SaaSマーケット** - 日本発のSaaS製品を探せるマーケットプレイス

- URL: https://saas-market.jp
- GitHub: （プライベート）

### 主な機能

- SaaS製品の検索・閲覧
- カテゴリー別ブラウジング
- 製品への問い合わせ
- 出品者ダッシュボード
- ブログ（コンテンツマーケティング）

## 技術スタック

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  Next.js 14 (App Router) + TypeScript       │
│  Tailwind CSS                               │
├─────────────────────────────────────────────┤
│                  Backend                     │
│  Next.js API Routes                         │
│  Supabase (PostgreSQL + Row Level Security) │
├─────────────────────────────────────────────┤
│                  Auth                        │
│  Clerk (日本語対応)                          │
├─────────────────────────────────────────────┤
│                  Hosting                     │
│  Vercel                                     │
└─────────────────────────────────────────────┘
```

### なぜこの構成にしたか

| 技術 | 選定理由 |
|------|----------|
| **Next.js 14** | App RouterでRSC活用、SEOに強い |
| **Supabase** | PostgreSQL + RLS + リアルタイムが無料枠で使える |
| **Clerk** | 日本語ローカライズ対応、Webhook連携が簡単 |
| **Vercel** | Next.jsとの相性、自動プレビューデプロイ |
| **Tailwind CSS** | 高速なUI開発、一貫したデザイン |

## ディレクトリ構成

```
saas-marketplace/
├── app/
│   ├── (auth)/           # 認証関連ページ
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (marketing)/      # 公開ページ
│   │   ├── page.tsx      # ホーム
│   │   ├── products/
│   │   ├── categories/
│   │   └── blog/
│   ├── dashboard/        # 認証必須ページ
│   │   ├── products/
│   │   └── inquiries/
│   ├── api/              # API Routes
│   ├── layout.tsx
│   ├── sitemap.ts        # 動的サイトマップ
│   └── robots.ts
├── components/
│   ├── layout/
│   ├── products/
│   └── seo/              # JSON-LDコンポーネント
├── lib/
│   ├── supabase.ts
│   └── blog/posts.ts
└── types/
    └── database.ts
```

## 実装のポイント

### 1. Supabase の Row Level Security (RLS)

マルチテナントでセキュアなデータアクセスを実現するため、RLSを活用しました。

```sql
-- products テーブルのRLSポリシー
-- 公開済み製品は誰でも閲覧可能
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (is_published = true);

-- 自分の製品のみ編集可能
CREATE POLICY "Users can update own products"
ON products FOR UPDATE
USING (auth.uid() = seller_id);
```

### 2. Clerk の日本語ローカライズ

Clerkは日本語UIに対応しています。

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 3. 動的サイトマップ生成

Next.js 14のMetadata APIでサイトマップを自動生成します。

```tsx
// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const staticPages = [
    { url: "https://saas-market.jp", priority: 1.0 },
    { url: "https://saas-market.jp/products", priority: 0.9 },
    { url: "https://saas-market.jp/categories", priority: 0.8 },
  ];

  const blogPages = posts.map((post) => ({
    url: `https://saas-market.jp/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
```

### 4. JSON-LD 構造化データ

Google検索でのリッチリザルト表示を狙って、JSON-LDを実装しました。

```tsx
// components/seo/JsonLd.tsx
export function BlogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  authorName,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "SaaSマーケット",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### 5. Open Graph メタタグ

SNSでシェアされた時の見栄えを良くします。

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://saas-market.jp"),
  title: {
    default: "SaaSマーケット | 日本のSaaS・サービスを見つけよう",
    template: "%s | SaaSマーケット",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "SaaSマーケット",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@saas_market_jp",
  },
};
```

## パフォーマンス最適化

### Server Components の活用

Next.js 14のApp Routerでは、デフォルトでServer Componentsが使われます。

```tsx
// app/products/page.tsx - Server Component
async function getProducts() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true);
  return data;
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 画像最適化

Next.js の `next/image` で自動最適化。

```tsx
import Image from "next/image";

<Image
  src={product.logo_url}
  alt={product.name}
  width={64}
  height={64}
  className="rounded-lg"
/>
```

## 開発で苦労したポイント

### 1. Clerk + Supabase の連携

ClerkのユーザーIDとSupabaseのRLSを連携させるのに苦労しました。

**解決策:** Clerk Webhookでユーザー作成時にSupabaseにも同期

```ts
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const { type, data } = await req.json();
  
  if (type === "user.created") {
    await supabase.from("sellers").insert({
      clerk_id: data.id,
      email: data.email_addresses[0].email_address,
    });
  }
}
```

### 2. 日本語SEOキーワード選定

日本市場向けなので、キーワード選定が重要でした。

```tsx
keywords: [
  "SaaS",
  "サース",        // カタカナ検索対応
  "SaaS比較",
  "クラウドサービス",
  "業務効率化",
  "DX",
],
```

## 今後の展望

- [ ] 製品レビュー機能
- [ ] AIによる製品レコメンド（MLOps経験を活かす！）
- [ ] 価格比較機能
- [ ] API提供

## まとめ

Next.js 14 + Supabase + Clerkの組み合わせは、日本向けSaaSを高速に開発するのに最適でした。

特に以下がポイントです：

1. **Supabase RLS** でセキュアなマルチテナント
2. **Clerk** の日本語対応で認証周りを省力化
3. **Next.js Metadata API** でSEO最適化
4. **Vercel** で自動デプロイ

ぜひ [SaaSマーケット](https://saas-market.jp) を使ってみてください！

質問があればコメント欄にどうぞ。

---

## リンク

- SaaSマーケット: https://saas-market.jp
- Twitter: [@saas_market_jp](https://twitter.com/saas_market_jp)

#Next.js #Supabase #Clerk #TypeScript #SaaS #日本語対応
