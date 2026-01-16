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
        className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
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
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-xl font-semibold text-slate-800 tracking-tight">
              SaaSマーケット
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/products"
                className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                プロダクト一覧
              </Link>
              <Link
                href="/categories"
                className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                カテゴリー
              </Link>
              <Link
                href="/pricing"
                className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                料金プラン
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isClerkConfigured ? (
              <ClerkComponents>
                {({ SignedIn, SignedOut, UserButton }) => (
                  <>
                    <SignedIn>
                      <Link
                        href="/dashboard"
                        className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
                      >
                        ダッシュボード
                      </Link>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 ring-2 ring-slate-100",
                          },
                        }}
                      />
                    </SignedIn>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
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
