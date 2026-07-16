"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 animate-scale-in">
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        登録しました — {email}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        // TODO: Wire to newsletter API endpoint when available
        setSubmitted(true);
      }}
      className="flex gap-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレスを入力"
        className="input max-w-xs text-sm"
      />
      <button
        type="submit"
        className="btn btn-primary text-sm flex-shrink-0 transition-transform duration-200 ease-snappy hover:-translate-y-0.5"
      >
        登録
      </button>
    </form>
  );
}
