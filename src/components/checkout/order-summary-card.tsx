"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore, type LocalCartItem } from "@/stores/cart-store";

const TAX_RATE = 0.0825;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

interface OrderSummaryCardProps {
  /** Optionally pass items directly (e.g. for confirmation step snapshot). */
  items?: LocalCartItem[];
}

export const OrderSummaryCard = ({ items: propItems }: OrderSummaryCardProps) => {
  const storeItems = useCartStore((s) => s.items);
  const items = propItems ?? storeItems;

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="size-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item list */}
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.vehicleId} className="flex items-start gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {item.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(item.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Est. Tax ({(TAX_RATE * 100).toFixed(2)}%)
            </span>
            <span>{formatPrice(tax)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
