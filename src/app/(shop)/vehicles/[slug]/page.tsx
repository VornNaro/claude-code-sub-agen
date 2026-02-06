import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { VehicleFeatures } from "@/components/vehicles/vehicle-features";
import { VehicleActions } from "@/components/vehicles/vehicle-actions";
import { VehicleDetailTabs } from "@/components/vehicles/vehicle-detail-tabs";

interface VehicleDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getVehicle(slug: string) {
  const caller = await api();
  return caller.vehicle.getBySlug({ slug });
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
    };
  }

  const price = Number(vehicle.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return {
    title: vehicle.name,
    description:
      vehicle.shortDescription ??
      `${vehicle.year} ${vehicle.name} - ${price}. ${vehicle.bodyType} available at Hyundai.`,
    openGraph: {
      title: vehicle.name,
      description: vehicle.shortDescription ?? undefined,
      images: vehicle.images?.[0]?.url ? [vehicle.images[0].url] : undefined,
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    notFound();
  }

  const primaryImage = vehicle.images?.find((img) => img.isPrimary) ?? vehicle.images?.[0];

  const breadcrumbItems = [
    { label: "Vehicles", href: "/vehicles" },
    { label: vehicle.name, href: `/vehicles/${vehicle.slug}` },
  ];

  const bodyTypeLabel = vehicle.bodyType
    ? vehicle.bodyType.charAt(0).toUpperCase() + vehicle.bodyType.slice(1)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Main layout: Gallery + Details */}
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left column: Gallery */}
        <div>
          <VehicleGallery
            images={vehicle.images ?? []}
            vehicleName={vehicle.name}
          />
        </div>

        {/* Right column: Vehicle info + Actions */}
        <div className="flex flex-col gap-6">
          {/* Vehicle header */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {vehicle.category && (
                <Badge variant="secondary">{vehicle.category.name}</Badge>
              )}
              {bodyTypeLabel && (
                <Badge variant="outline">{bodyTypeLabel}</Badge>
              )}
              {vehicle.isNew && (
                <Badge className="bg-accent text-accent-foreground">New</Badge>
              )}
              {vehicle.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {vehicle.name}
            </h1>

            {vehicle.shortDescription && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {vehicle.shortDescription}
              </p>
            )}

            {vehicle.vin && (
              <p className="text-xs text-muted-foreground">
                VIN: <span className="font-mono">{vehicle.vin}</span>
              </p>
            )}
          </div>

          <Separator />

          {/* Actions: Price + Buttons */}
          <VehicleActions
            vehicleId={vehicle.id}
            vehicleName={vehicle.name}
            price={vehicle.price}
            msrp={vehicle.msrp}
            imageUrl={primaryImage?.url ?? null}
          />

          <Separator />

          {/* Quick specs summary */}
          <div className="grid grid-cols-2 gap-3">
            {vehicle.year && (
              <QuickSpec label="Year" value={String(vehicle.year)} />
            )}
            {vehicle.fuelType && (
              <QuickSpec label="Fuel" value={vehicle.fuelType} />
            )}
            {vehicle.transmission && (
              <QuickSpec label="Transmission" value={vehicle.transmission} />
            )}
            {vehicle.drivetrain && (
              <QuickSpec label="Drivetrain" value={vehicle.drivetrain} />
            )}
            {vehicle.mileage != null && (
              <QuickSpec
                label="Mileage"
                value={`${vehicle.mileage.toLocaleString()} mi`}
              />
            )}
            {vehicle.horsepower && (
              <QuickSpec label="Power" value={`${vehicle.horsepower} hp`} />
            )}
          </div>
        </div>
      </div>

      {/* Full description */}
      {vehicle.description && (
        <div className="mt-10">
          <h2 className="mb-3 text-xl font-bold">About This Vehicle</h2>
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {vehicle.description}
          </p>
        </div>
      )}

      {/* Tabbed sections */}
      <div className="mt-10">
        <VehicleDetailTabs
          specsContent={<VehicleSpecs vehicle={vehicle} />}
          featuresContent={<VehicleFeatures features={vehicle.features} />}
        />
      </div>
    </div>
  );
}

function QuickSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
