"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const ForgotPasswordForm = dynamic(() => import("./ForgotPasswordForm"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
