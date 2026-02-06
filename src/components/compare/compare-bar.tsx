"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, X, GitCompareArrows, Trash2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useCompareStore } from "@/stores/compare-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MAX_COMPARE = 4;

export function CompareBar() {
  const pathname = usePathname();
  const vehicleIds = useCompareStore((s) => s.vehicleIds);
  const removeVehicle = useCompareStore((s) => s.removeVehicle);
  const clearAll = useCompareStore((s) => s.clearAll);

  // Avoid hydration mismatch -- store is persisted in localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: vehicles } = trpc.vehicle.getByIds.useQuery(
    { ids: vehicleIds },
    { enabled: mounted && vehicleIds.length > 0 },
  );

  // Hide on the compare page itself or when there are no items
  const isComparePage = pathname === "/compare";
  const shouldShow = mounted && vehicleIds.length > 0 && !isComparePage;

  const emptySlots = MAX_COMPARE - vehicleIds.length;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-sm",
        "transition-transform duration-300 ease-in-out",
        shouldShow ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container mx-auto flex items-center gap-4 px-4 py-3">
        {/* Vehicle count label */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <GitCompareArrows className="size-5 text-primary" />
          <span className="text-sm font-medium">Compare</span>
          <Badge variant="secondary" className="text-xs">
            {vehicleIds.length}/{MAX_COMPARE}
          </Badge>
        </div>

        {/* Vehicle thumbnails + empty slots */}
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {vehicles?.map((vehicle) => {
            const primaryImage =
              vehicle.images?.find((img) => img.isPrimary) ??
              vehicle.images?.[0];
            return (
              <div
                key={vehicle.id}
                className="group relative flex shrink-0 items-center gap-2 rounded-lg border bg-card p-1.5 pr-7"
              >
                {/* Thumbnail */}
                <div className="relative size-10 overflow-hidden rounded bg-muted">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt ?? vehicle.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[8px] text-muted-foreground">
                      N/A
                    </div>
                  )}
                </div>
                {/* Name */}
                <span className="hidden max-w-[100px] truncate text-xs font-medium md:block">
                  {vehicle.name}
                </span>
                {/* Remove */}
                <button
                  onClick={() => removeVehicle(vehicle.id)}
                  className={cn(
                    "absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center",
                    "rounded-full border bg-background text-muted-foreground shadow-sm",
                    "transition-colors hover:bg-destructive hover:text-white",
                  )}
                  aria-label={`Remove ${vehicle.name} from comparison`}
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })}

          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <Link
              key={`empty-${i}`}
              href="/vehicles"
              className={cn(
                "flex size-10 shrink-0 items-center justify-center",
                "rounded-lg border-2 border-dashed border-muted-foreground/30",
                "text-muted-foreground/40 transition-colors hover:border-primary hover:text-primary",
              )}
              aria-label="Add a vehicle to compare"
            >
              <Plus className="size-4" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
          <Button size="sm" asChild>
            <Link href="/compare">
              <GitCompareArrows className="size-3.5" />
              <span>Compare Now</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
