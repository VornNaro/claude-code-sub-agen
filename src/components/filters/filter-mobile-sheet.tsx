"use client";

import { useState, useMemo } from "react";
import { useQueryStates } from "nuqs";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { FilterSidebar, filterParsers } from "@/components/filters/filter-sidebar";

export const FilterMobileSheet = () => {
  const [open, setOpen] = useState(false);

  const [filters] = useQueryStates(filterParsers, {
    shallow: false,
  });

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </Button>
      <SheetContent side="left" className="w-[320px] overflow-y-auto p-0 sm:max-w-[360px]">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Filter Vehicles</SheetTitle>
          <SheetDescription>
            Narrow down your search with the options below.
          </SheetDescription>
        </SheetHeader>
        <div className="px-2 py-4">
          <FilterSidebar className="border-0 bg-transparent p-2" />
        </div>
        <SheetFooter className="border-t">
          <SheetClose asChild>
            <Button variant="default" className="w-full">
              View Results
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
