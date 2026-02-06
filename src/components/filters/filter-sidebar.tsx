"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { VEHICLE_BODY_TYPES, FUEL_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PRICE_MIN = 15_000;
const PRICE_MAX = 100_000;
const PRICE_STEP = 1_000;
const YEAR_MIN = 2020;
const YEAR_MAX = 2025;

const CONDITIONS = [
  { value: "all", label: "All" },
  { value: "true", label: "New" },
  { value: "false", label: "Used" },
] as const;

/**
 * nuqs parsers for all filter URL search params.
 * Shared between sidebar and other consumers.
 */
export const filterParsers = {
  bodyType: parseAsString,
  fuelType: parseAsString,
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  minYear: parseAsInteger,
  maxYear: parseAsInteger,
  isNew: parseAsString,
  search: parseAsString,
};

interface FilterSidebarProps {
  className?: string;
}

export const FilterSidebar = ({ className }: FilterSidebarProps) => {
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useQueryStates(filterParsers, {
    shallow: false,
    startTransition,
  });

  // --- Derived state ---
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.bodyType) count++;
    if (filters.fuelType) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minYear) count++;
    if (filters.maxYear) count++;
    if (filters.isNew) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const priceValue: [number, number] = useMemo(
    () => [filters.minPrice ?? PRICE_MIN, filters.maxPrice ?? PRICE_MAX],
    [filters.minPrice, filters.maxPrice],
  );

  // --- Helpers ---
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const clearAllFilters = useCallback(() => {
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
  }, [setFilters]);

  // Toggle a body type value (single-select via URL string)
  const toggleBodyType = useCallback(
    (value: string) => {
      setFilters({
        bodyType: filters.bodyType === value ? null : value,
      });
    },
    [filters.bodyType, setFilters],
  );

  // Toggle a fuel type value
  const toggleFuelType = useCallback(
    (value: string) => {
      setFilters({
        fuelType: filters.fuelType === value ? null : value,
      });
    },
    [filters.fuelType, setFilters],
  );

  const setCondition = useCallback(
    (value: string) => {
      setFilters({
        isNew: value === "all" ? null : value,
      });
    },
    [setFilters],
  );

  const handlePriceSliderChange = useCallback(
    (values: number[]) => {
      setFilters({
        minPrice: values[0] === PRICE_MIN ? null : values[0],
        maxPrice: values[1] === PRICE_MAX ? null : values[1],
      });
    },
    [setFilters],
  );

  const handleMinPriceInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const num = raw ? parseInt(raw, 10) : null;
      setFilters({
        minPrice:
          num === null || num <= PRICE_MIN
            ? null
            : Math.min(num, filters.maxPrice ?? PRICE_MAX),
      });
    },
    [filters.maxPrice, setFilters],
  );

  const handleMaxPriceInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const num = raw ? parseInt(raw, 10) : null;
      setFilters({
        maxPrice:
          num === null || num >= PRICE_MAX
            ? null
            : Math.max(num, filters.minPrice ?? PRICE_MIN),
      });
    },
    [filters.minPrice, setFilters],
  );

  const handleMinYearInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const num = raw ? parseInt(raw, 10) : null;
      setFilters({
        minYear: num === null || num <= YEAR_MIN ? null : Math.min(num, YEAR_MAX),
      });
    },
    [setFilters],
  );

  const handleMaxYearInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const num = raw ? parseInt(raw, 10) : null;
      setFilters({
        maxYear: num === null || num >= YEAR_MAX ? null : Math.max(num, YEAR_MIN),
      });
    },
    [setFilters],
  );

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        isPending && "opacity-70 pointer-events-none",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator className="my-3" />

      {/* Accordion filter sections */}
      <Accordion
        type="multiple"
        defaultValue={["bodyType", "price", "year", "fuelType", "condition"]}
        className="w-full"
      >
        {/* ----- Body Type ----- */}
        <AccordionItem value="bodyType">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Body Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_BODY_TYPES.map((type) => {
                const isActive = filters.bodyType === type.value;
                return (
                  <Button
                    key={type.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBodyType(type.value)}
                    className={cn(
                      "h-8 text-xs",
                      isActive && "shadow-sm",
                    )}
                  >
                    {type.label}
                    {isActive && <X className="ml-1 size-3" />}
                  </Button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ----- Price Range ----- */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceValue}
                onValueChange={handlePriceSliderChange}
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label
                    htmlFor="minPrice"
                    className="mb-1 block text-xs text-muted-foreground"
                  >
                    Min
                  </label>
                  <Input
                    id="minPrice"
                    type="text"
                    inputMode="numeric"
                    placeholder={formatPrice(PRICE_MIN)}
                    value={
                      filters.minPrice ? formatPrice(filters.minPrice) : ""
                    }
                    onChange={handleMinPriceInput}
                    className="h-8 text-xs"
                  />
                </div>
                <span className="mt-5 text-muted-foreground">-</span>
                <div className="flex-1">
                  <label
                    htmlFor="maxPrice"
                    className="mb-1 block text-xs text-muted-foreground"
                  >
                    Max
                  </label>
                  <Input
                    id="maxPrice"
                    type="text"
                    inputMode="numeric"
                    placeholder={formatPrice(PRICE_MAX)}
                    value={
                      filters.maxPrice ? formatPrice(filters.maxPrice) : ""
                    }
                    onChange={handleMaxPriceInput}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPrice(priceValue[0])} - {formatPrice(priceValue[1])}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ----- Year ----- */}
        <AccordionItem value="year">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Year
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label
                  htmlFor="minYear"
                  className="mb-1 block text-xs text-muted-foreground"
                >
                  From
                </label>
                <Input
                  id="minYear"
                  type="number"
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  placeholder={String(YEAR_MIN)}
                  value={filters.minYear ?? ""}
                  onChange={handleMinYearInput}
                  className="h-8 text-xs"
                />
              </div>
              <span className="mt-5 text-muted-foreground">-</span>
              <div className="flex-1">
                <label
                  htmlFor="maxYear"
                  className="mb-1 block text-xs text-muted-foreground"
                >
                  To
                </label>
                <Input
                  id="maxYear"
                  type="number"
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  placeholder={String(YEAR_MAX)}
                  value={filters.maxYear ?? ""}
                  onChange={handleMaxYearInput}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ----- Fuel Type ----- */}
        <AccordionItem value="fuelType">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Fuel Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((type) => {
                const isActive = filters.fuelType === type.value;
                return (
                  <Button
                    key={type.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFuelType(type.value)}
                    className={cn(
                      "h-8 text-xs",
                      isActive && "shadow-sm",
                    )}
                  >
                    {type.label}
                    {isActive && <X className="ml-1 size-3" />}
                  </Button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ----- Condition ----- */}
        <AccordionItem value="condition">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Condition
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2">
              {CONDITIONS.map((cond) => {
                const isActive =
                  cond.value === "all"
                    ? !filters.isNew
                    : filters.isNew === cond.value;
                return (
                  <Button
                    key={cond.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCondition(cond.value)}
                    className="h-8 flex-1 text-xs"
                  >
                    {cond.label}
                  </Button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
