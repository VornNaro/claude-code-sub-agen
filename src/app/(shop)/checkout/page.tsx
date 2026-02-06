"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummaryCard } from "@/components/checkout/order-summary-card";
import { StepIndicator } from "@/components/checkout/step-indicator";

/**
 * Because the cart store is hydrated from localStorage we need to wait for
 * client-side hydration before deciding whether to show the empty-cart state.
 * Otherwise on first render `items` will always be [] (the Zustand default)
 * and the user would briefly see the empty message even if items exist.
 */
const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
};

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const hydrated = useHydrated();
  const [currentStep, setCurrentStep] = useState(1);

  // Show a loading skeleton while waiting for hydration
  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  // Empty cart state -- only show when NOT on the confirmation step.
  // Once the order is placed the cart is cleared, but we still show confirmation.
  if (items.length === 0 && currentStep < 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="size-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              You need to add some vehicles to your cart before checking out.
            </p>
            <Button asChild className="mt-6">
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
      <p className="mb-6 text-muted-foreground">
        Complete your purchase in a few simple steps.
      </p>

      <StepIndicator currentStep={currentStep} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column: Multi-step form */}
        <div>
          <CheckoutForm onStepChange={setCurrentStep} />
        </div>

        {/* Right column: Order summary (hidden on confirmation step) */}
        {currentStep < 3 && (
          <aside className="hidden lg:block">
            <OrderSummaryCard />
          </aside>
        )}
      </div>
    </div>
  );
}
