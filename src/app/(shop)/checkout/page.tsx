import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Hyundai vehicle purchase.",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Multi-step checkout with Stripe integration will be built in Phase 4.
      </p>
    </div>
  );
}
