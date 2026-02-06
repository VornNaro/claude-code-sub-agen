"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitCompareArrows, Plus, Trash2 } from "lucide-react";
import { useCompareStore } from "@/stores/compare-store";
import { CompareTable } from "@/components/compare/compare-table";
import { CompareEmpty } from "@/components/compare/compare-empty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const MAX_COMPARE = 4;

export default function ComparePage() {
  const vehicleIds = useCompareStore((s) => s.vehicleIds);
  const clearAll = useCompareStore((s) => s.clearAll);

  // Prevent hydration mismatch -- Zustand persists to localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const count = vehicleIds.length;
  const canAddMore = count < MAX_COMPARE;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <GitCompareArrows className="size-7 text-primary" />
            <h1 className="text-3xl font-bold">Compare Vehicles</h1>
            {count > 0 && (
              <Badge variant="secondary">
                {count} vehicle{count !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <p className="mt-2 text-muted-foreground">
            {count > 0
              ? "Review specs, features, and pricing side by side."
              : "Add up to 4 vehicles to compare specs, features, and pricing side by side."}
          </p>
        </div>

        {count > 0 && (
          <div className="flex items-center gap-2">
            {canAddMore && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/vehicles">
                  <Plus className="size-3.5" />
                  Add More
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Content */}
      {count > 0 ? <CompareTable /> : <CompareEmpty />}
    </div>
  );
}
