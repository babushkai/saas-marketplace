import Link from "next/link";

const plans = [
  {
    name: "フリー",
    price: "¥0",
    period: "永久無料",
    description: "まずは試してみたい方向け",
    features: [
      "1プロダクトまで掲載",
      "基本的なプロダクトページ",
      "月間100PVまで",
      "問い合わせフォーム",
      "メールサポート",
    ],
    cta: "無料で始める",
    highlighted: false,
  },
  {
    name: "スタンダード",
    price: "¥4,980",
    period: "/月",
    description: "成長中のSaaS企業向け",
    features: [
      "5プロダクトまで掲載",
      "カスタムプロダクトページ",
      "無制限のPV",
      "問い合わせフォーム",
      "優先メールサポート",
      "アナリティクスダッシュボード",
      "注目プロダクトへの掲載",
    ],
    cta: "スタンダードを選択",
    highlighted: true,
  },
  {
    name: "プロ",
    price: "¥14,980",
    period: "/月",
    description: "大規模なSaaS企業向け",
    features: [
      "無制限のプロダクト掲載",
      "プレミアムプロダクトページ",
      "無制限のPV",
      "問い合わせフォーム + API連携",
      "専属サポート担当",
      "高度なアナリティクス",
      "トップページへの掲載",
      "カスタムブランディング",
      "リード情報のエクスポート",
    ],
    cta: "プロを選択",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "無料プランでもプロダクトを掲載できますか？",
    answer:
      "はい、無料プランでも1つのプロダクトを掲載できます。まずは無料プランでお試しいただき、必要に応じてアップグレードしてください。",
  },
  {
    question: "プランの変更はいつでもできますか？",
    answer:
      "はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。",
  },
  {
    question: "支払い方法は何がありますか？",
    answer:
      "クレジットカード（Visa, Mastercard, JCB, American Express）、銀行振込、請求書払いに対応しています。",
  },
  {
    question: "年払いの割引はありますか？",
    answer:
      "はい、年払いをお選びいただくと、月払いと比較して2ヶ月分お得になります。詳しくはお問い合わせください。",
  },
];

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            シンプルな料金プラン
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            あなたのビジネスの規模に合わせて、最適なプランをお選びください。
            いつでもアップグレード・ダウングレードが可能です。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card p-8 ${
                plan.highlighted
                  ? "border-2 border-primary-600 ring-2 ring-primary-100"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  人気No.1
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-600 mt-1 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`w-full btn text-center ${
                  plan.highlighted ? "btn-primary" : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            よくある質問
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            ご不明な点がございましたら、お気軽にお問い合わせください
          </p>
          <Link href="/contact" className="btn btn-primary">
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}
