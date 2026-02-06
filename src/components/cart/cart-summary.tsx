"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";

const TAX_RATE = 0.085;

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const estimatedTax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + estimatedTax;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Line items breakdown */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Tax (8.5%)</span>
            <span className="font-medium">{formatPrice(estimatedTax)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-hyundai-success">Free</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>

        <Separator />

        {/* Promo code input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="promo-code"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Tag className="size-3.5" />
            Promo Code
          </label>
          <div className="flex gap-2">
            <Input
              id="promo-code"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                if (promoApplied) setPromoApplied(false);
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="default"
              onClick={handleApplyPromo}
              disabled={!promoCode.trim()}
            >
              Apply
            </Button>
          </div>
          {promoApplied && (
            <p className="text-xs text-muted-foreground">
              Invalid or expired promo code. Please try another.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">
            Proceed to Checkout
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Tax and total are estimates. Final amounts will be calculated at
          checkout.
        </p>
      </CardFooter>
    </Card>
  );
}
