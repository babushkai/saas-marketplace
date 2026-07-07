"use client";

import { useState, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

interface InquiryFormProps {
  productId: string;
  productName: string;
}

export function InquiryForm({ productId, productName }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      product_id: productId,
      sender_name: formData.get("name") as string,
      sender_email: formData.get("email") as string,
      sender_company: formData.get("company") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      setIsSubmitted(true);
      showToast("お問い合わせを送信しました", "success");
      formRef.current?.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "エラーが発生しました";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
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
        </div>
        <p className="font-medium text-gray-900">送信完了</p>
        <p className="text-sm text-gray-600 mt-1">
          お問い合わせありがとうございます。
          <br />
          担当者より折り返しご連絡いたします。
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="btn btn-outline btn-sm mt-4"
        >
          別の問い合わせをする
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        「{productName}」について詳しく知りたい方はお問い合わせください。
      </p>

      <div>
        <label htmlFor="name" className="label">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="input"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="input"
          placeholder="taro@example.com"
        />
      </div>

      <div>
        <label htmlFor="company" className="label">
          会社名
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="input"
          placeholder="株式会社サンプル"
        />
      </div>

      <div>
        <label htmlFor="message" className="label">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="input resize-none"
          placeholder="ご質問やご要望をお書きください"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
