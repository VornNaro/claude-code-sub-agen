import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  DashboardMobileNav,
  DashboardDesktopSidebar,
} from "@/components/dashboard/dashboard-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              My Account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your orders, wishlist, and account settings.
            </p>
          </div>

          {/* Mobile: horizontal tab navigation at top */}
          <DashboardMobileNav />

          {/* Two-column layout: sidebar (desktop only) + content */}
          <div className="mt-6 flex gap-8">
            <DashboardDesktopSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
