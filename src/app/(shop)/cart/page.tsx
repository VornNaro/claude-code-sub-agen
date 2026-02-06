import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected Hyundai vehicles.",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <p className="mt-2 text-muted-foreground">
        Cart with vehicle items and checkout summary will be built in Phase 4.
      </p>
    </div>
  );
}
