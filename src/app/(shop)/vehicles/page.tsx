import { Suspense } from "react";
import type { Metadata } from "next";

import { SORT_OPTIONS } from "@/lib/constants";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { FilterMobileSheet } from "@/components/filters/filter-mobile-sheet";
import { SortSelect } from "@/components/filters/sort-select";
import { ActiveFilters } from "@/components/filters/active-filters";
import { VehicleInfiniteList } from "@/components/vehicles/vehicle-infinite-list";
import type { VehicleFilters } from "@/components/vehicles/vehicle-infinite-list";

export const metadata: Metadata = {
  title: "All Vehicles",
  description: "Browse our complete lineup of Hyundai vehicles.",
};

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((o) => o.value));

function parseSortParam(value: string | undefined): SortValue | undefined {
  if (value && VALID_SORTS.has(value)) {
    return value as SortValue;
  }
  return undefined;
}

function parseNumberParam(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBooleanParam(value: string | undefined): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

interface VehiclesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const params = await searchParams;

  const filters: VehicleFilters = {
    bodyType: typeof params.bodyType === "string" ? params.bodyType : undefined,
    minPrice: parseNumberParam(
      typeof params.minPrice === "string" ? params.minPrice : undefined,
    ),
    maxPrice: parseNumberParam(
      typeof params.maxPrice === "string" ? params.maxPrice : undefined,
    ),
    minYear: parseNumberParam(
      typeof params.minYear === "string" ? params.minYear : undefined,
    ),
    maxYear: parseNumberParam(
      typeof params.maxYear === "string" ? params.maxYear : undefined,
    ),
    fuelType: typeof params.fuelType === "string" ? params.fuelType : undefined,
    isNew: parseBooleanParam(
      typeof params.isNew === "string" ? params.isNew : undefined,
    ),
    sort: parseSortParam(
      typeof params.sort === "string" ? params.sort : undefined,
    ),
    search: typeof params.search === "string" ? params.search : undefined,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Vehicles</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our complete Hyundai lineup. Use filters to narrow your search.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebar />
            </Suspense>
          </div>
        </aside>

        {/* Main content area */}
        <section>
          {/* Toolbar: mobile filter trigger + sort */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <Suspense fallback={null}>
              <FilterMobileSheet />
            </Suspense>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>

          {/* Active filter chips */}
          <div className="mb-4">
            <Suspense fallback={null}>
              <ActiveFilters />
            </Suspense>
          </div>

          {/* Vehicle infinite scroll grid */}
          <VehicleInfiniteList filters={filters} />
        </section>
      </div>
    </div>
  );
}

/** Lightweight skeleton for the filter sidebar during Suspense. */
function FilterSidebarSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card p-4">
      <div className="mb-4 h-5 w-16 rounded bg-muted" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
