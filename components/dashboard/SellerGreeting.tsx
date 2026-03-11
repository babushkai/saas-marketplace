"use client";

import { useState, useEffect } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}

export function SellerGreeting({ displayName }: { displayName: string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  if (!greeting) return <h1 className="text-2xl font-bold text-gray-900">{displayName}さんのダッシュボード</h1>;

  return (
    <h1 className="text-2xl font-bold text-gray-900">
      {greeting}、{displayName}さん
    </h1>
  );
}
