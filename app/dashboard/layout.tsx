import { DashboardSidebar, DashboardMobileNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar — desktop only */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <DashboardSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-20 md:pb-6 bg-gray-50">{children}</main>

      {/* Bottom nav — mobile only */}
      <DashboardMobileNav />
    </div>
  );
}
