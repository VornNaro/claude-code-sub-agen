import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VehicleListItem } from "@/types";

interface VehicleCardProps {
  vehicle: VehicleListItem;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryImage = vehicle.images?.[0];
  const price = Number(vehicle.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Link href={`/vehicles/${vehicle.slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? vehicle.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {vehicle.isNew && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              New
            </Badge>
          )}
          {vehicle.isFeatured && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2"
            >
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="mb-1 text-xs font-medium text-accent uppercase tracking-wide">
            {vehicle.category?.name ?? vehicle.bodyType}
          </div>
          <h3 className="font-semibold text-foreground line-clamp-1">
            {vehicle.name}
          </h3>
          <p className="mt-1 text-lg font-bold text-primary">{price}</p>
        </CardContent>

        {/* Specs footer */}
        <CardFooter className="border-t px-4 py-3">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {vehicle.year}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {vehicle.mileage?.toLocaleString() ?? 0} mi
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5" />
              {vehicle.fuelType ?? "N/A"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
