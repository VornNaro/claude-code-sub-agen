"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  GitCompareArrows,
  Loader2,
  Search,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

import { trpc } from "@/trpc/client";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Register global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  // Fetch search results with tRPC
  const {
    data,
    isLoading: isSearching,
    isFetching,
  } = trpc.vehicle.getInfiniteList.useInfiniteQuery(
    {
      limit: 6,
      search: debouncedQuery,
      sort: "newest",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: debouncedQuery.length > 0,
    },
  );

  const results = data?.pages.flatMap((page) => page.items) ?? [];
  const isLoadingResults = (isSearching || isFetching) && debouncedQuery.length > 0;
  const hasQuery = debouncedQuery.length > 0;
  const hasResults = results.length > 0;

  const navigateAndClose = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      navigateAndClose(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, navigateAndClose]);

  const formatPrice = (price: string | number) =>
    Number(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Vehicles"
      description="Search for Hyundai vehicles by name, model, or body type."
      showCloseButton={false}
    >
      <CommandInput
        placeholder="Search vehicles..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Loading state */}
        {isLoadingResults && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}

        {/* Empty state -- only show when we have a query, are done loading, and found nothing */}
        {hasQuery && !isLoadingResults && !hasResults && (
          <CommandEmpty>No vehicles found.</CommandEmpty>
        )}

        {/* Vehicle results */}
        {hasResults && (
          <CommandGroup heading="Vehicles">
            {results.map((vehicle) => (
              <CommandItem
                key={vehicle.id}
                value={vehicle.name}
                onSelect={() => navigateAndClose(`/vehicles/${vehicle.slug}`)}
                className="cursor-pointer"
              >
                <Car className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="truncate font-medium">{vehicle.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {vehicle.year} &middot; {formatPrice(vehicle.price)}
                    </span>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {vehicle.bodyType}
                  </Badge>
                </div>
              </CommandItem>
            ))}

            {/* View all results link */}
            {query.trim() && (
              <CommandItem
                onSelect={handleViewAll}
                className="cursor-pointer justify-center text-accent"
              >
                <span className="flex items-center gap-1 text-sm font-medium">
                  View all results
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CommandItem>
            )}
          </CommandGroup>
        )}

        {/* Quick links -- always shown */}
        <CommandSeparator />
        <CommandGroup heading="Quick Links">
          <CommandItem
            onSelect={() => navigateAndClose("/vehicles")}
            className="cursor-pointer"
          >
            <Car className="mr-2 h-4 w-4 text-muted-foreground" />
            All Vehicles
          </CommandItem>
          <CommandItem
            onSelect={() => navigateAndClose("/compare")}
            className="cursor-pointer"
          >
            <GitCompareArrows className="mr-2 h-4 w-4 text-muted-foreground" />
            Compare Vehicles
          </CommandItem>
          <CommandItem
            onSelect={() => navigateAndClose("/cart")}
            className="cursor-pointer"
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
            Shopping Cart
          </CommandItem>
        </CommandGroup>
      </CommandList>

      {/* Footer hint */}
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Search className="h-3 w-3" />
          <span>Type to search vehicles</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
            Esc
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </CommandDialog>
  );
}
