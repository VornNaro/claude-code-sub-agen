import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Vehicles",
  description: "Compare up to 4 Hyundai vehicles side by side.",
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Compare Vehicles</h1>
      <p className="mt-2 text-muted-foreground">
        Add up to 4 vehicles to compare specs, features, and pricing
        side by side. Comparison table will be built in Phase 4.
      </p>
    </div>
  );
}
