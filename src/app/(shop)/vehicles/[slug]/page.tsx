import type { Metadata } from "next";

interface VehicleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  };
}

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold capitalize">
        {slug.replace(/-/g, " ")}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Vehicle detail page with gallery, specs, and reviews will be built in
        Phase 3.
      </p>
    </div>
  );
}
