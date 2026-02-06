"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore, type LocalCartItem } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: LocalCartItem;
  /** Compact mode for the cart sheet (smaller image, tighter spacing) */
  compact?: boolean;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const removeItem = useCartStore((s) => s.removeItem);

  const handleRemove = () => {
    removeItem(item.vehicleId);
    toast.info(`${item.name} removed from cart`, {
      action: {
        label: "Undo",
        onClick: () => {
          useCartStore.getState().addItem({
            vehicleId: item.vehicleId,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          });
        },
      },
    });
  };

  const imageSize = compact ? 48 : 64;

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        compact ? "py-3" : "py-4",
      )}
    >
      {/* Vehicle image */}
      <Link
        href={`/vehicles/${item.vehicleId}`}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md bg-muted",
          compact ? "size-12" : "size-16",
        )}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={imageSize}
            height={imageSize}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No img
          </div>
        )}
      </Link>

      {/* Name and price */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/vehicles/${item.vehicleId}`}
          className="truncate font-medium text-foreground hover:text-primary transition-colors"
        >
          {item.name}
        </Link>
        <span className={cn(
          "font-semibold text-primary",
          compact ? "text-sm" : "text-base",
        )}>
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size={compact ? "icon-xs" : "icon-sm"}
        onClick={handleRemove}
        aria-label={`Remove ${item.name} from cart`}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <X className={compact ? "size-3" : "size-4"} />
      </Button>
    </div>
  );
}
