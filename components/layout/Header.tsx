"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Clerk components to handle when not configured
const ClerkComponents = dynamic(
  () =>
    import("@clerk/nextjs").then((mod) => ({
      default: ({
        children,
      }: {
        children: (props: {
          SignedIn: typeof mod.SignedIn;
          SignedOut: typeof mod.SignedOut;
          UserButton: typeof mod.UserButton;
        }) => React.ReactNode;
      }) =>
        children({
          SignedIn: mod.SignedIn,
          SignedOut: mod.SignedOut,
          UserButton: mod.UserButton,
        }),
    })),
  {
    ssr: false,
    loading: () => <AuthFallback />,
  }
);

function AuthFallback() {
  return (
    <>
      <Link
        href="/sign-in"
        className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        ログイン
      </Link>
      <Link href="/sign-up" className="btn btn-primary text-sm">
        無料で始める
      </Link>
    </>
  );
}

export function Header() {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured =
    clerkPubKey &&
    !clerkPubKey.includes("placeholder") &&
    !clerkPubKey.includes("xxx");

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:block">
                SaaS<span className="text-primary-600">マーケット</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/products"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
              >
                プロダクト一覧
              </Link>
              <Link
                href="/categories"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
              >
                カテゴリー
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
              >
                料金プラン
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isClerkConfigured ? (
              <ClerkComponents>
                {({ SignedIn, SignedOut, UserButton }) => (
                  <>
                    <SignedIn>
                      <Link
                        href="/dashboard"
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
                      >
                        ダッシュボード
                      </Link>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-9 h-9 ring-2 ring-gray-100",
                          },
                        }}
                      />
                    </SignedIn>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
                      >
                        ログイン
                      </Link>
                      <Link href="/sign-up" className="btn btn-primary text-sm">
                        無料で始める
                      </Link>
                    </SignedOut>
                  </>
                )}
              </ClerkComponents>
            ) : (
              <AuthFallback />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
