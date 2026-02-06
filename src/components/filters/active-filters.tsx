"use client";

import { useMemo, useTransition } from "react";
import { useQueryStates } from "nuqs";
import { X } from "lucide-react";

import { VEHICLE_BODY_TYPES, FUEL_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { filterParsers } from "@/components/filters/filter-sidebar";

/** Format a currency value for display in a chip. */
const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

/** Look up a human label from a constant array by value. */
const findLabel = (
  list: ReadonlyArray<Readonly<{ value: string; label: string }>>,
  value: string,
) => list.find((item) => item.value === value)?.label ?? value;

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export const ActiveFilters = () => {
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useQueryStates(filterParsers, {
    shallow: false,
    startTransition,
  });

  const chips: ActiveChip[] = useMemo(() => {
    const result: ActiveChip[] = [];

    if (filters.bodyType) {
      result.push({
        key: "bodyType",
        label: `Body: ${findLabel(VEHICLE_BODY_TYPES, filters.bodyType)}`,
        onRemove: () => setFilters({ bodyType: null }),
      });
    }

    if (filters.fuelType) {
      result.push({
        key: "fuelType",
        label: `Fuel: ${findLabel(FUEL_TYPES, filters.fuelType)}`,
        onRemove: () => setFilters({ fuelType: null }),
      });
    }

    if (filters.minPrice) {
      result.push({
        key: "minPrice",
        label: `Min: ${formatPrice(filters.minPrice)}`,
        onRemove: () => setFilters({ minPrice: null }),
      });
    }

    if (filters.maxPrice) {
      result.push({
        key: "maxPrice",
        label: `Max: ${formatPrice(filters.maxPrice)}`,
        onRemove: () => setFilters({ maxPrice: null }),
      });
    }

    if (filters.minYear) {
      result.push({
        key: "minYear",
        label: `From: ${filters.minYear}`,
        onRemove: () => setFilters({ minYear: null }),
      });
    }

    if (filters.maxYear) {
      result.push({
        key: "maxYear",
        label: `To: ${filters.maxYear}`,
        onRemove: () => setFilters({ maxYear: null }),
      });
    }

    if (filters.isNew) {
      result.push({
        key: "isNew",
        label: filters.isNew === "true" ? "New" : "Used",
        onRemove: () => setFilters({ isNew: null }),
      });
    }

    if (filters.search) {
      result.push({
        key: "search",
        label: `Search: "${filters.search}"`,
        onRemove: () => setFilters({ search: null }),
      });
    }

    return result;
  }, [filters, setFilters]);

  if (chips.length === 0) return null;

  const clearAll = () => {
    setFilters({
      bodyType: null,
      fuelType: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      isNew: null,
      search: null,
    });
  };

  return (
    <div
      className={
        "flex flex-wrap items-center gap-2" +
        (isPending ? " opacity-70 pointer-events-none" : "")
      }
    >
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="link"
        size="xs"
        onClick={clearAll}
        className="text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
};
