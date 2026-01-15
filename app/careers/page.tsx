import Link from "next/link";

const positions = [
  {
    id: "1",
    title: "フルスタックエンジニア",
    department: "エンジニアリング",
    type: "正社員",
    location: "東京（リモート可）",
    description:
      "Next.js、TypeScript、Supabaseを使用したプラットフォーム開発をリードしていただきます。",
  },
  {
    id: "2",
    title: "プロダクトマネージャー",
    department: "プロダクト",
    type: "正社員",
    location: "東京",
    description:
      "SaaSマーケットプレイスのプロダクト戦略策定と機能開発のリードをお任せします。",
  },
  {
    id: "3",
    title: "カスタマーサクセス",
    department: "カスタマーサクセス",
    type: "正社員",
    location: "東京（リモート可）",
    description:
      "出品者様の成功をサポートし、プラットフォームの価値最大化を推進していただきます。",
  },
  {
    id: "4",
    title: "マーケティングマネージャー",
    department: "マーケティング",
    type: "正社員",
    location: "東京",
    description:
      "B2Bマーケティング戦略の立案・実行、ブランド構築をリードしていただきます。",
  },
  {
    id: "5",
    title: "UIデザイナー",
    department: "デザイン",
    type: "正社員・業務委託",
    location: "フルリモート",
    description:
      "ユーザー体験を重視したUI/UXデザインを担当していただきます。",
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "フレキシブルワーク",
    description: "リモートワーク可能、フレックスタイム制度を導入しています。",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "競争力のある報酬",
    description: "業界水準以上の給与、ストックオプション制度があります。",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "学習支援",
    description: "書籍購入、カンファレンス参加、オンライン学習の費用を支援します。",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "健康サポート",
    description: "健康診断、メンタルヘルスサポート、スポーツジム補助があります。",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "チームイベント",
    description: "定期的なチームビルディング、オフサイトミーティングを開催しています。",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "最新技術",
    description: "最新の技術スタックで開発でき、技術的チャレンジを推奨しています。",
  },
];

export default function CareersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            一緒に日本のSaaS市場を
            <br />
            変革しませんか？
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            私たちは、日本のSaaSエコシステムを活性化させる
            情熱を持った仲間を探しています。
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            福利厚生・働く環境
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            募集中のポジション
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            現在募集中のポジションです。ご興味のある方はお気軽にご応募ください。
          </p>
          <div className="space-y-4 max-w-4xl mx-auto">
            {positions.map((position) => (
              <div
                key={position.id}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {position.department}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {position.type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {position.location}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      {position.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href={`/contact?subject=採用応募: ${position.title}`}
                      className="btn btn-primary whitespace-nowrap"
                    >
                      応募する
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            希望のポジションがありませんか？
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            現在募集していないポジションでも、あなたのスキルや経験に合った
            ポジションをご用意できるかもしれません。お気軽にご連絡ください。
          </p>
          <Link href="/contact" className="btn btn-primary">
            オープンポジションに応募
          </Link>
        </div>
      </section>
    </div>
  );
}
