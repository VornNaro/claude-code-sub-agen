"use client";

import { useTransition } from "react";
import { useQueryState, parseAsString } from "nuqs";

import { SORT_OPTIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortSelectProps {
  totalResults?: number;
}

export const SortSelect = ({ totalResults }: SortSelectProps) => {
  const [isPending, startTransition] = useTransition();

  const [sort, setSort] = useQueryState("sort", {
    ...parseAsString,
    defaultValue: "newest",
    shallow: false,
    startTransition,
  });

  return (
    <div className="flex items-center gap-3">
      {typeof totalResults === "number" && (
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          <span className="font-medium text-foreground">{totalResults.toLocaleString()}</span>{" "}
          vehicle{totalResults !== 1 ? "s" : ""}
        </p>
      )}
      <Select
        value={sort}
        onValueChange={(value) => setSort(value)}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px]" size="sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent position="popper" align="end">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
