"use client";

import { useCallback } from "react";
import { ShoppingCart, GitCompareArrows, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useCompareStore } from "@/stores/compare-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";

interface VehicleActionsProps {
  vehicleId: string;
  vehicleName: string;
  price: string;
  msrp: string | null;
  imageUrl: string | null;
}

export function VehicleActions({
  vehicleId,
  vehicleName,
  price,
  msrp,
  imageUrl,
}: VehicleActionsProps) {
  const { items, addItem, removeItem } = useCartStore();
  const { vehicleIds: compareIds, addVehicle: addCompare, removeVehicle: removeCompare } =
    useCompareStore();
  const { vehicleIds: wishlistIds, toggleVehicle: toggleWishlist } =
    useWishlistStore();

  const isInCart = items.some((i) => i.vehicleId === vehicleId);
  const isInCompare = compareIds.includes(vehicleId);
  const isInWishlist = wishlistIds.includes(vehicleId);
  const compareIsFull = compareIds.length >= 4 && !isInCompare;

  const numericPrice = Number(price);
  const numericMsrp = msrp ? Number(msrp) : null;
  const hasMsrpDifference =
    numericMsrp != null && numericMsrp !== numericPrice && numericMsrp > numericPrice;

  const formattedPrice = numericPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const formattedMsrp = numericMsrp
    ? numericMsrp.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : null;

  const savings = hasMsrpDifference
    ? (numericMsrp - numericPrice).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : null;

  const handleCartToggle = useCallback(() => {
    if (isInCart) {
      removeItem(vehicleId);
      toast.info(`${vehicleName} removed from cart`);
    } else {
      addItem({
        vehicleId,
        name: vehicleName,
        price: numericPrice,
        imageUrl,
      });
      toast.success(`${vehicleName} added to cart`);
    }
  }, [isInCart, vehicleId, vehicleName, numericPrice, imageUrl, addItem, removeItem]);

  const handleCompareToggle = useCallback(() => {
    if (isInCompare) {
      removeCompare(vehicleId);
      toast.info(`${vehicleName} removed from comparison`);
    } else {
      if (compareIsFull) {
        toast.warning("Compare list is full. Remove a vehicle first.");
        return;
      }
      addCompare(vehicleId);
      toast.success(`${vehicleName} added to comparison`);
    }
  }, [isInCompare, compareIsFull, vehicleId, vehicleName, addCompare, removeCompare]);

  const handleWishlistToggle = useCallback(() => {
    if (isInWishlist) {
      toggleWishlist(vehicleId);
      toast.info(`${vehicleName} removed from wishlist`);
    } else {
      toggleWishlist(vehicleId);
      toast.success(`${vehicleName} added to wishlist`);
    }
  }, [isInWishlist, vehicleId, vehicleName, toggleWishlist]);

  return (
    <div className="flex flex-col gap-4">
      {/* Price display */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {formattedPrice}
          </span>
          {hasMsrpDifference && formattedMsrp && (
            <span className="text-lg text-muted-foreground line-through">
              {formattedMsrp}
            </span>
          )}
        </div>
        {savings && (
          <p className="text-sm font-medium text-hyundai-success">
            You save {savings}
          </p>
        )}
      </div>

      <Separator />

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full"
          onClick={handleCartToggle}
        >
          <ShoppingCart className="h-4 w-4" />
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleCompareToggle}
            disabled={compareIsFull}
            title={
              compareIsFull
                ? "Compare list is full (max 4 vehicles)"
                : isInCompare
                  ? "Remove from comparison"
                  : "Add to comparison"
            }
          >
            <GitCompareArrows className="h-4 w-4" />
            {isInCompare ? "In Compare" : "Compare"}
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isInWishlist && "fill-red-500 text-red-500",
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
