export function SellerGreeting({ displayName }: { displayName: string }) {
  return (
    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
      {displayName}のダッシュボード
    </h1>
  );
}
