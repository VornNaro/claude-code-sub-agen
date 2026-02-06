"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useCompareStore } from "@/stores/compare-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { VehicleCompareItem } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: string | number) {
  return Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatMileage(mileage: number | null | undefined) {
  if (mileage == null) return "N/A";
  return `${mileage.toLocaleString()} mi`;
}

/** Determine if a numeric field value is the "best" among all vehicles. */
function isBestValue(
  value: number | null | undefined,
  allValues: (number | null | undefined)[],
  mode: "lowest" | "highest",
): boolean {
  const nums = allValues.filter((v): v is number => v != null);
  if (nums.length < 2) return false;
  if (value == null) return false;
  const best = mode === "lowest" ? Math.min(...nums) : Math.max(...nums);
  return value === best;
}

// ---------------------------------------------------------------------------
// Row specification
// ---------------------------------------------------------------------------

interface SpecRow {
  label: string;
  getValue: (v: VehicleCompareItem) => string | number | null | undefined;
  /** When set, highlights the best numeric value across vehicles. */
  highlight?: "lowest" | "highest";
}

const SPEC_ROWS: SpecRow[] = [
  {
    label: "Price",
    getValue: (v) => formatPrice(v.price),
    highlight: "lowest",
  },
  { label: "Year", getValue: (v) => v.year, highlight: "highest" },
  {
    label: "Body Type",
    getValue: (v) =>
      v.bodyType
        ? v.bodyType.charAt(0).toUpperCase() + v.bodyType.slice(1)
        : "N/A",
  },
  { label: "Fuel Type", getValue: (v) => v.fuelType ?? "N/A" },
  { label: "Transmission", getValue: (v) => v.transmission ?? "N/A" },
  { label: "Engine", getValue: (v) => v.engineSize ?? "N/A" },
  {
    label: "Horsepower",
    getValue: (v) => (v.horsepower != null ? `${v.horsepower} hp` : "N/A"),
    highlight: "highest",
  },
  { label: "Drivetrain", getValue: (v) => v.drivetrain ?? "N/A" },
  {
    label: "Seating",
    getValue: (v) =>
      v.seatingCapacity != null ? `${v.seatingCapacity}` : "N/A",
    highlight: "highest",
  },
  {
    label: "Mileage",
    getValue: (v) => formatMileage(v.mileage),
    highlight: "lowest",
  },
  { label: "Exterior Color", getValue: (v) => v.exteriorColor ?? "N/A" },
  { label: "Interior Color", getValue: (v) => v.interiorColor ?? "N/A" },
];

/** Extract the raw numeric value for highlight comparison. */
function getRawNumeric(
  row: SpecRow,
  vehicle: VehicleCompareItem,
): number | null | undefined {
  switch (row.label) {
    case "Price":
      return Number(vehicle.price);
    case "Year":
      return vehicle.year;
    case "Horsepower":
      return vehicle.horsepower;
    case "Seating":
      return vehicle.seatingCapacity;
    case "Mileage":
      return vehicle.mileage;
    default:
      return undefined;
  }
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function CompareTableSkeleton({ count }: { count: number }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="min-w-[140px] bg-muted/50 p-4" />
            {Array.from({ length: count }).map((_, i) => (
              <th key={i} className="min-w-[200px] p-4">
                <Skeleton className="mx-auto mb-3 h-32 w-full max-w-[180px] rounded-lg" />
                <Skeleton className="mx-auto h-5 w-28" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="bg-muted/50 p-4">
                <Skeleton className="h-4 w-24" />
              </td>
              {Array.from({ length: count }).map((_, j) => (
                <td key={j} className="p-4">
                  <Skeleton className="mx-auto h-4 w-20" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CompareTable() {
  const vehicleIds = useCompareStore((s) => s.vehicleIds);
  const removeVehicle = useCompareStore((s) => s.removeVehicle);

  const { data: vehicles, isLoading } = trpc.vehicle.getByIds.useQuery(
    { ids: vehicleIds },
    { enabled: vehicleIds.length > 0 },
  );

  if (isLoading) {
    return <CompareTableSkeleton count={vehicleIds.length} />;
  }

  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full">
        {/* ---- Header: vehicle images, names, actions ---- */}
        <thead>
          <tr className="border-b">
            {/* Sticky label column */}
            <th
              className={cn(
                "sticky left-0 z-10 min-w-[140px] bg-background p-4",
                "text-left text-sm font-medium text-muted-foreground",
              )}
            >
              Specifications
            </th>
            {vehicles.map((vehicle) => {
              const primaryImage = vehicle.images?.find((img) => img.isPrimary) ?? vehicle.images?.[0];
              return (
                <th
                  key={vehicle.id}
                  className="min-w-[200px] p-4 text-center align-top"
                >
                  {/* Remove button */}
                  <div className="mb-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeVehicle(vehicle.id)}
                      aria-label={`Remove ${vehicle.name} from comparison`}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>

                  {/* Vehicle image */}
                  <div className="relative mx-auto mb-3 aspect-[16/10] w-full max-w-[200px] overflow-hidden rounded-lg bg-muted">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt ?? vehicle.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Vehicle name */}
                  <div className="mb-1 text-sm font-semibold leading-tight">
                    {vehicle.name}
                  </div>

                  {/* Badges */}
                  <div className="mb-2 flex flex-wrap justify-center gap-1">
                    {vehicle.isNew && (
                      <Badge variant="secondary" className="text-[10px]">
                        New
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {vehicle.year}
                    </Badge>
                  </div>

                  {/* View details */}
                  <Button variant="link" size="sm" asChild>
                    <Link href={`/vehicles/${vehicle.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* ---- Body: spec rows ---- */}
        <tbody>
          {SPEC_ROWS.map((row) => {
            const rawNumerics = vehicles.map((v) => getRawNumeric(row, v));
            return (
              <tr
                key={row.label}
                className="border-b last:border-0 transition-colors hover:bg-muted/50"
              >
                {/* Sticky label */}
                <td
                  className={cn(
                    "sticky left-0 z-10 bg-background p-4",
                    "text-sm font-medium text-muted-foreground",
                  )}
                >
                  {row.label}
                </td>

                {/* Vehicle values */}
                {vehicles.map((vehicle, idx) => {
                  const displayValue = row.getValue(vehicle);
                  const highlighted =
                    row.highlight &&
                    isBestValue(rawNumerics[idx], rawNumerics, row.highlight);
                  return (
                    <td
                      key={vehicle.id}
                      className={cn(
                        "p-4 text-center text-sm",
                        highlighted && "font-bold text-primary",
                      )}
                    >
                      {displayValue ?? "N/A"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
