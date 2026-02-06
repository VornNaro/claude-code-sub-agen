import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Hyundai account, orders, and wishlist.",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Account overview with orders, wishlist, and garage will be built in
        Phase 4.
      </p>
    </div>
  );
}
