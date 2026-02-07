"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useCompareStore } from "@/stores/compare-store";
import { CartSheet } from "@/components/cart/cart-sheet";
import dynamic from "next/dynamic";

const ClerkActions = dynamic(() => import("./clerk-actions"), { ssr: false });

export function HeaderActions() {
  const itemCount = useCartStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.vehicleIds.length);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/search">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Link>
      </Button>

      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/compare">
          <GitCompareArrows className="h-5 w-5" />
          {mounted && compareCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {compareCount}
            </span>
          )}
          <span className="sr-only">Compare</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setCartOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            {itemCount}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Button>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <ClerkActions />
    </div>
  );
}
