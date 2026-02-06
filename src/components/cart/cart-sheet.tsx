"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "./cart-item";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const items = useCartStore((s) => s.items);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Shopping Cart{" "}
            {!isEmpty && (
              <span className="text-muted-foreground font-normal">
                ({items.length})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your cart items and quick summary
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse our collection to find your perfect Hyundai.
              </p>
            </div>
            <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
              <Link href="/vehicles">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable items list */}
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItem key={item.vehicleId} item={item} compact />
                ))}
              </div>
            </ScrollArea>

            {/* Footer with summary */}
            <SheetFooter className="border-t">
              <div className="flex w-full flex-col gap-3">
                {/* Mini summary */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes and shipping calculated at checkout.
                </p>

                <Separator />

                {/* Actions */}
                <Button asChild size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                  <Link href="/cart">
                    View Cart
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/vehicles">Continue Shopping</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
