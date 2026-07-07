export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-8">
            最終更新日: 2024年1月1日
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">はじめに</h2>
            <p className="text-gray-700 leading-relaxed">
              SaaSマーケットプレイス（以下「当社」といいます。）は、本ウェブサイト上で提供するサービス（以下「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第1条（収集する情報）</h2>
            <p className="text-gray-700 mb-4">当社は、以下の情報を収集することがあります。</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>アカウント情報:</strong> 氏名、メールアドレス、パスワード、会社名、役職など
              </li>
              <li>
                <strong>プロフィール情報:</strong> プロフィール画像、自己紹介文、ウェブサイトURL、SNSアカウントなど
              </li>
              <li>
                <strong>プロダクト情報:</strong> 出品者が登録するプロダクト名、説明、価格、スクリーンショットなど
              </li>
              <li>
                <strong>利用情報:</strong> アクセスログ、IPアドレス、ブラウザ情報、閲覧履歴、検索履歴など
              </li>
              <li>
                <strong>決済情報:</strong> クレジットカード情報（決済代行会社を通じて処理されます）
              </li>
              <li>
                <strong>お問い合わせ情報:</strong> お問い合わせフォームから送信された内容
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第2条（情報の利用目的）</h2>
            <p className="text-gray-700 mb-4">収集した情報は、以下の目的で利用します。</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>本サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため</li>
              <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
              <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
              <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
              <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
              <li>サービス改善やマーケティングのための統計データの作成のため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第3条（情報の第三者提供）</h2>
            <p className="text-gray-700 mb-4">
              当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第4条（Cookieの使用）</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当社は、本サービスにおいてCookieを使用しています。Cookieは、ユーザーのブラウザに保存される小さなテキストファイルで、以下の目的で使用されます。
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>ログイン状態の維持</li>
              <li>ユーザー設定の保存</li>
              <li>サービスの利用状況の分析</li>
              <li>広告配信の最適化</li>
            </ul>
            <p className="text-gray-700 mt-4">
              ユーザーは、ブラウザの設定によりCookieの受け入れを拒否することができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第5条（セキュリティ）</h2>
            <p className="text-gray-700 leading-relaxed">
              当社は、個人情報の漏洩、滅失、毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。具体的には、SSL/TLSによる通信の暗号化、パスワードのハッシュ化、アクセス制御、定期的なセキュリティ監査などを実施しています。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第6条（個人情報の開示・訂正・削除）</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>ユーザーは、当社に対して個人情報の開示を求めることができます。</li>
              <li>ユーザーは、当社が保有する個人情報が誤りである場合、訂正または削除を求めることができます。</li>
              <li>開示・訂正・削除のご請求は、お問い合わせフォームよりご連絡ください。</li>
              <li>当社は、ご請求いただいた方がご本人であることを確認の上、合理的な期間内に対応いたします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第7条（アクセス解析ツール）</h2>
            <p className="text-gray-700 leading-relaxed">
              当社は、本サービスの利用状況を把握するために、Google Analyticsなどのアクセス解析ツールを使用しています。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。詳細については、各ツールのプライバシーポリシーをご確認ください。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第8条（プライバシーポリシーの変更）</h2>
            <p className="text-gray-700 leading-relaxed">
              当社は、必要に応じて、本ポリシーを変更することがあります。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。重要な変更がある場合は、本サービス上でお知らせいたします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">第9条（お問い合わせ窓口）</h2>
            <p className="text-gray-700 leading-relaxed">
              本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>SaaSマーケットプレイス 個人情報保護担当</strong><br />
                メールアドレス: privacy@saas-marketplace.jp
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
