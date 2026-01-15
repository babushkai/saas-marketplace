"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock data - replace with actual API call
const mockInquiry = {
  id: "1",
  product: {
    id: "1",
    name: "クラウド請求書",
    slug: "cloud-invoice",
  },
  sender_name: "佐藤 健太",
  sender_email: "sato@example-corp.jp",
  sender_company: "株式会社サンプル",
  message: `お世話になっております。株式会社サンプルの佐藤と申します。

貴社の「クラウド請求書」サービスについて、以下の点についてお伺いしたく、ご連絡させていただきました。

1. 既存の会計ソフト（弥生会計）との連携は可能でしょうか？
2. 現在50名程度の会社ですが、推奨のプランはどちらになりますでしょうか？
3. 導入時のデータ移行サポートはありますでしょうか？
4. 無料トライアル期間はありますでしょうか？

お忙しいところ恐れ入りますが、ご回答いただけますと幸いです。

何卒よろしくお願いいたします。`,
  is_read: false,
  created_at: "2024-01-15T10:30:00Z",
};

export default function InquiryDetailPage() {
  const params = useParams();
  const inquiryId = params.id as string;

  const [inquiry, setInquiry] = useState(mockInquiry);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    // TODO: Fetch inquiry from API
    const fetchInquiry = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Mark as read
      setInquiry({ ...mockInquiry, is_read: true });
      setIsLoading(false);
    };
    fetchInquiry();
  }, [inquiryId]);

  const handleReply = () => {
    const subject = encodeURIComponent(`Re: ${inquiry.product.name}についてのお問い合わせ`);
    const body = encodeURIComponent(replyMessage);
    window.location.href = `mailto:${inquiry.sender_email}?subject=${subject}&body=${body}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/inquiries"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          問い合わせ一覧に戻る
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              問い合わせ詳細
            </h1>
            <p className="text-gray-600 mt-1">
              {formatDate(inquiry.created_at)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              inquiry.is_read
                ? "bg-gray-100 text-gray-600"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {inquiry.is_read ? "既読" : "未読"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inquiry Message */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              お問い合わせ内容
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-line text-gray-700">
                {inquiry.message}
              </p>
            </div>
          </div>

          {/* Reply Section */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">返信する</h2>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={8}
              className="input resize-none mb-4"
              placeholder="返信メッセージを入力してください..."
            />
            <div className="flex items-center gap-4">
              <button
                onClick={handleReply}
                disabled={!replyMessage.trim()}
                className="btn btn-primary"
              >
                メールで返信
              </button>
              <a
                href={`mailto:${inquiry.sender_email}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                または直接メールを開く
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ※ 「メールで返信」をクリックすると、お使いのメールアプリが開きます
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sender Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">送信者情報</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500">お名前</dt>
                <dd className="mt-1 font-medium text-gray-900">
                  {inquiry.sender_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">メールアドレス</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${inquiry.sender_email}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {inquiry.sender_email}
                  </a>
                </dd>
              </div>
              {inquiry.sender_company && (
                <div>
                  <dt className="text-sm text-gray-500">会社名</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {inquiry.sender_company}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Product Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">対象プロダクト</h2>
            <Link
              href={`/products/${inquiry.product.slug}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                {inquiry.product.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {inquiry.product.name}
                </p>
                <p className="text-xs text-gray-500">プロダクトページを見る →</p>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">アクション</h2>
            <div className="space-y-3">
              <button className="w-full btn btn-secondary text-sm justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                アーカイブする
              </button>
              <button className="w-full btn bg-red-50 text-red-600 hover:bg-red-100 text-sm justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                削除する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
