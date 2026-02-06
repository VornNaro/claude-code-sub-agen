import {
  Calendar,
  Car,
  Fuel,
  Gauge,
  Cog,
  Zap,
  CircleDot,
  Users,
  Palette,
  Armchair,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VehicleDetail } from "@/types";

interface SpecItem {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

interface VehicleSpecsProps {
  vehicle: VehicleDetail;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs: SpecItem[] = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Year",
      value: vehicle.year,
    },
    {
      icon: <Car className="h-4 w-4" />,
      label: "Body Type",
      value: vehicle.bodyType
        ? vehicle.bodyType.charAt(0).toUpperCase() + vehicle.bodyType.slice(1)
        : null,
    },
    {
      icon: <Fuel className="h-4 w-4" />,
      label: "Fuel Type",
      value: vehicle.fuelType,
    },
    {
      icon: <Cog className="h-4 w-4" />,
      label: "Transmission",
      value: vehicle.transmission,
    },
    {
      icon: <Gauge className="h-4 w-4" />,
      label: "Engine",
      value: vehicle.engineSize,
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: "Horsepower",
      value: vehicle.horsepower ? `${vehicle.horsepower} hp` : null,
    },
    {
      icon: <CircleDot className="h-4 w-4" />,
      label: "Drivetrain",
      value: vehicle.drivetrain,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Seating",
      value: vehicle.seatingCapacity
        ? `${vehicle.seatingCapacity} passengers`
        : null,
    },
    {
      icon: <Gauge className="h-4 w-4" />,
      label: "Mileage",
      value:
        vehicle.mileage != null
          ? `${vehicle.mileage.toLocaleString()} mi`
          : null,
    },
    {
      icon: <Palette className="h-4 w-4" />,
      label: "Exterior Color",
      value: vehicle.exteriorColor,
    },
    {
      icon: <Armchair className="h-4 w-4" />,
      label: "Interior Color",
      value: vehicle.interiorColor,
    },
  ];

  const displaySpecs = specs.filter(
    (spec) => spec.value != null && spec.value !== "",
  );

  if (displaySpecs.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No specifications available for this vehicle.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {displaySpecs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                {spec.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {spec.label}
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {spec.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
