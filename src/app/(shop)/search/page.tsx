import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/search/search-input";
import { VehicleInfiniteList } from "@/components/vehicles/vehicle-infinite-list";
import { VehicleCardSkeleton } from "@/components/vehicles/vehicle-card-skeleton";
import { VehicleGrid } from "@/components/vehicles/vehicle-grid";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for Hyundai vehicles by name, model, or features.",
};

const SUGGESTED_SEARCHES = [
  { label: "Ioniq 5", query: "Ioniq 5" },
  { label: "Tucson", query: "Tucson" },
  { label: "Electric", query: "Electric" },
  { label: "SUV", query: "SUV" },
  { label: "Santa Fe", query: "Santa Fe" },
  { label: "Sedan", query: "Sedan" },
];

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search input */}
      <div className="mx-auto max-w-2xl">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>

      {/* Content area */}
      <div className="mt-8">
        {query ? (
          <SearchResults query={query} />
        ) : (
          <EmptySearchState />
        )}
      </div>
    </div>
  );
}

/** Shown when a search query is present -- renders heading + infinite list */
function SearchResults({ query }: { query: string }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Search results for &ldquo;{query}&rdquo;
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing vehicles matching your search term.
        </p>
      </div>

      <Suspense
        fallback={
          <VehicleGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </VehicleGrid>
        }
      >
        <VehicleInfiniteList filters={{ search: query }} />
      </Suspense>
    </div>
  );
}

/** Shown when no query is entered -- prompts the user and suggests popular searches */
function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        Search Vehicles
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Enter a search term to find vehicles by name, model, body type, or
        other features.
      </p>

      {/* Suggested searches */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Popular searches
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_SEARCHES.map((suggestion) => (
            <Badge
              key={suggestion.query}
              variant="outline"
              asChild
              className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Link href={`/search?q=${encodeURIComponent(suggestion.query)}`}>
                {suggestion.label}
              </Link>
            </Badge>
          ))}
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="mt-8 text-xs text-muted-foreground">
        Tip: Press{" "}
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          Ctrl+K
        </kbd>{" "}
        anywhere to open quick search.
      </p>
    </div>
  );
}
