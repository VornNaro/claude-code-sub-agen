"use client";

import { useCallback } from "react";
import { Loader2, SearchX } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { PAGINATION } from "@/lib/constants";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleCardSkeleton } from "@/components/vehicles/vehicle-card-skeleton";
import { VehicleGrid } from "@/components/vehicles/vehicle-grid";

type SortValue = "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";

export interface VehicleFilters {
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  isNew?: boolean;
  sort?: SortValue;
  search?: string;
}

interface VehicleInfiniteListProps {
  filters: VehicleFilters;
}

export function VehicleInfiniteList({ filters }: VehicleInfiniteListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = trpc.vehicle.getInfiniteList.useInfiniteQuery(
    {
      limit: PAGINATION.defaultLimit,
      bodyType: filters.bodyType,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minYear: filters.minYear,
      maxYear: filters.maxYear,
      fuelType: filters.fuelType,
      isNew: filters.isNew,
      sort: filters.sort ?? "newest",
      search: filters.search,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: hasNextPage === true && !isFetchingNextPage,
    rootMargin: "0px 0px 400px 0px",
  });

  const allVehicles = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = allVehicles.length;

  if (isLoading) {
    return (
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Loading vehicles...
        </p>
        <VehicleGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </VehicleGrid>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-semibold text-destructive">
          Failed to load vehicles
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.message ?? "An unexpected error occurred. Please try again."}
        </p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <SearchX className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-semibold">No vehicles found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search terms to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {totalCount} vehicle{totalCount !== 1 ? "s" : ""}
      </p>

      <VehicleGrid>
        {allVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </VehicleGrid>

      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="h-px" />

      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading more...
        </div>
      )}

      {!hasNextPage && totalCount > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          You have reached the end of the list.
        </p>
      )}
    </div>
  );
}
