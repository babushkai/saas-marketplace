"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface InquiryData {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  sender_name: string;
  sender_email: string;
  sender_company: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const inquiryId = params.id as string;

  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const fetchInquiry = async () => {
      setIsLoading(true);
      try {
        // For now, we'll need to fetch from the inquiries list
        // In a full implementation, you'd have a dedicated API endpoint
        const response = await fetch(`/api/inquiries/${inquiryId}`);
        if (response.ok) {
          const data = await response.json();
          setInquiry(data.inquiry);
        } else {
          // Fallback: show error
          setError("お問い合わせの取得に失敗しました");
        }
      } catch (err) {
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInquiry();
  }, [inquiryId]);

  const handleReply = () => {
    if (!inquiry) return;
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

  if (error || !inquiry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          お問い合わせが見つかりません
        </h2>
        <p className="text-gray-600 mb-4">
          {error || "指定されたお問い合わせは存在しないか、削除されました。"}
        </p>
        <Link href="/dashboard/inquiries" className="btn btn-primary">
          お問い合わせ一覧に戻る
        </Link>
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
        </div>
      </div>
    </div>
  );
}
