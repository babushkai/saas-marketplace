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
        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              SaaSマーケット
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                プロダクト一覧
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        ダッシュボード
                      </Link>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                          },
                        }}
                      />
                    </SignedIn>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
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
