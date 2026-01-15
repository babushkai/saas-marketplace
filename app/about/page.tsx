import Link from "next/link";

const stats = [
  { label: "掲載プロダクト数", value: "500+" },
  { label: "月間訪問者数", value: "50,000+" },
  { label: "登録企業数", value: "1,200+" },
  { label: "問い合わせ成約率", value: "23%" },
];

const team = [
  {
    name: "田中 太郎",
    role: "代表取締役 / CEO",
    bio: "元大手IT企業のプロダクトマネージャー。日本のSaaS市場の可能性を信じ、2023年に創業。",
  },
  {
    name: "佐藤 花子",
    role: "CTO",
    bio: "フルスタックエンジニア。複数のスタートアップでテックリードを経験後、創業メンバーとして参画。",
  },
  {
    name: "鈴木 一郎",
    role: "COO",
    bio: "大手コンサルティングファーム出身。B2Bマーケティングとセールスのエキスパート。",
  },
];

const values = [
  {
    title: "日本発のイノベーションを世界へ",
    description:
      "日本には素晴らしいSaaS製品がたくさんあります。私たちはそれらを国内外に広め、日本のテック産業の発展に貢献します。",
  },
  {
    title: "透明性と信頼",
    description:
      "すべてのプロダクト情報は正確で透明性があります。ユーザーが安心して意思決定できる環境を提供します。",
  },
  {
    title: "コミュニティファースト",
    description:
      "SaaS開発者とユーザーのコミュニティを大切にし、双方にとって価値のあるプラットフォームを目指します。",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            日本のSaaSエコシステムを
            <br />
            もっと活発に
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            私たちは、日本発のSaaS製品と、それを必要とする企業をつなぐ
            マーケットプレイスを運営しています。
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              私たちのミッション
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              日本には、世界に誇れる素晴らしいSaaS製品がたくさん生まれています。
              しかし、それらを見つけることは簡単ではありません。
              私たちは、日本のSaaS市場をもっとオープンで活発なものにするため、
              プロダクトと企業をつなぐプラットフォームを構築しています。
              <br />
              <br />
              出品者には、自社製品をアピールする場を。
              購入者には、最適なツールを見つける手段を。
              両者にとって価値のあるマーケットプレイスを目指しています。
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            私たちの価値観
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            チーム
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">一緒に働きませんか？</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            私たちは、日本のSaaS市場を変革する仲間を探しています。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers" className="btn btn-primary">
              採用情報を見る
            </Link>
            <Link
              href="/contact"
              className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
