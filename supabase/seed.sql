-- Seed data for SaaS Marketplace
-- Run this in Supabase SQL Editor after schema.sql

-- Create a demo seller (dsuke)
INSERT INTO sellers (
  id,
  clerk_user_id,
  username,
  display_name,
  company_name,
  bio,
  avatar_url,
  website_url,
  twitter_url
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'demo_user_dsuke',
  'dsuke',
  'dsuke',
  NULL,
  'RAG開発ツールの情報を整理・発信しています',
  NULL,
  'https://rag-catalog.vercel.app',
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Add RAG Catalog product
INSERT INTO products (
  id,
  seller_id,
  slug,
  name,
  tagline,
  description,
  category,
  pricing_type,
  price_info,
  logo_url,
  screenshots,
  website_url,
  is_published
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'rag-catalog',
  'RAG カタログ',
  'RAG開発に必要なツールを一覧・比較できるカタログサイト',
  '## RAG カタログとは

RAGアプリケーション開発に必要なフレームワーク、ベクトルDB、エンベディングモデル、評価ツールなど45以上のツールを一覧・比較できるカタログサイトです。

### 主な機能

- **カテゴリー別ブラウズ**: フレームワーク、ベクトルDB、エンベディング、評価ツールなど8カテゴリーで整理
- **GitHub Stars表示**: 各ツールの人気度をGitHub Starsで確認
- **タグフィルタリング**: Python、TypeScript、オープンソースなどのタグで絞り込み
- **検索機能**: ツール名、説明、タグで横断検索
- **詳細情報**: 各ツールのライセンス、公式サイト、GitHubリンクを掲載

### 対象ユーザー

- RAGアプリケーションを開発するエンジニア
- LLMを活用したシステム構築を検討している方
- 最新のRAGエコシステムを調査したい方

### 技術スタック

Next.js 14 / TypeScript / Tailwind CSS / Vercel',
  'development',
  'free',
  '無料で利用可能',
  NULL,
  '[]'::jsonb,
  'https://rag-catalog.vercel.app',
  true
) ON CONFLICT (id) DO NOTHING;
