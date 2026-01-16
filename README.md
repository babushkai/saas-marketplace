# SaaSマーケット

日本のSaaS・サービスを見つけよう | Japanese SaaS Marketplace

[![CI](https://github.com/babushkai/saas-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/babushkai/saas-marketplace/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

SaaSマーケットは、日本発のSaaS製品・サービスを探せるオープンソースのマーケットプレイスです。500以上のSaaSツールから、ビジネスに最適なツールを見つけることができます。

SaaS Market is an open-source marketplace for discovering Japanese SaaS products and services. Find the perfect tools for your business from 500+ SaaS solutions.

## Features

- **Product Discovery** - Browse and search SaaS products by category
- **Seller Profiles** - Dedicated pages for SaaS vendors
- **User Dashboard** - Manage products, inquiries, and analytics
- **Blog** - Articles about SaaS trends and comparisons
- **SEO Optimized** - Dynamic OG images, sitemap, structured data
- **Bilingual** - Japanese UI with Clerk localization

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) + Google Analytics
- **Deployment**: [Vercel](https://vercel.com/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/babushkai/saas-marketplace.git
cd saas-marketplace
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=xxx
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes
│   ├── blog/             # Blog pages
│   ├── dashboard/        # User dashboard
│   ├── products/         # Product listings
│   └── ...
├── components/           # React components
│   ├── analytics/        # Analytics components
│   ├── layout/           # Header, Footer
│   ├── seo/              # JSON-LD, meta components
│   └── ui/               # UI components
├── lib/                  # Utilities and helpers
└── public/               # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**桑原大将 (Daisuke Kuwahara)** - [@babushkai](https://github.com/babushkai)

---

Built with Next.js and open source
