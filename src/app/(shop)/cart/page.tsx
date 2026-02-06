"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const isEmpty = items.length === 0;

  const handleClearCart = () => {
    const previousItems = [...items];
    clearCart();
    toast.info("Cart cleared", {
      action: {
        label: "Undo",
        onClick: () => {
          previousItems.forEach((item) => {
            useCartStore.getState().addItem({
              vehicleId: item.vehicleId,
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
            });
          });
        },
      },
    });
  };

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Looks like you have not added any vehicles to your cart yet. Explore
              our collection to find the perfect Hyundai for you.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/vehicles">
              <ArrowLeft className="size-4" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="mt-1 text-muted-foreground">
            {items.length} {items.length === 1 ? "vehicle" : "vehicles"} in your
            cart
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          className="w-fit text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="size-4" />
          Clear Cart
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column: cart items */}
        <div>
          <div className="divide-y divide-border rounded-lg border bg-card p-4 shadow-sm sm:p-6">
            {items.map((item) => (
              <CartItem key={item.vehicleId} item={item} />
            ))}
          </div>

          {/* Continue shopping link */}
          <div className="mt-6">
            <Button variant="ghost" asChild>
              <Link href="/vehicles">
                <ArrowLeft className="size-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Right column: order summary (sticky) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
