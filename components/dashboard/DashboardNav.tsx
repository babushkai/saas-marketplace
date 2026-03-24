"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "ダッシュボード",
    shortLabel: "ホーム",
    badgeKey: null as string | null,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/products",
    label: "プロダクト管理",
    shortLabel: "プロダクト",
    badgeKey: null,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/inquiries",
    label: "お問い合わせ",
    shortLabel: "問合せ",
    badgeKey: "inquiries",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/analytics",
    label: "アクセス解析",
    shortLabel: "解析",
    badgeKey: null,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "公開プロフィール",
    shortLabel: "プロフィール",
    badgeKey: null,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "設定",
    shortLabel: "設定",
    badgeKey: null,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

interface NavProps {
  unreadInquiries?: number;
  sellerName?: string;
  avatarUrl?: string | null;
}

export function DashboardSidebar({ unreadInquiries = 0, sellerName, avatarUrl }: NavProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Seller identity */}
      {sellerName && (
        <div className="px-4 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">
                  {sellerName.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 truncate">{sellerName}</span>
          </div>
        </div>
      )}

      <nav className="p-3 space-y-0.5 flex-1">
        {sidebarLinks.map((link) => {
          const active = isActive(pathname, link.href);
          const badge = link.badgeKey === "inquiries" ? unreadInquiries : 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                active
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={active ? "text-primary-600" : "text-gray-400"}>{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function DashboardMobileNav({ unreadInquiries = 0 }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
      <div className="flex justify-around items-center h-14 px-1">
        {sidebarLinks.map((link) => {
          const active = isActive(pathname, link.href);
          const badge = link.badgeKey === "inquiries" ? unreadInquiries : 0;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-0 ${
                active ? "text-primary-600" : "text-gray-400"
              }`}
            >
              {link.icon}
              <span className="text-[10px] leading-tight truncate">{link.shortLabel}</span>
              {badge > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-[9px] font-semibold min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
