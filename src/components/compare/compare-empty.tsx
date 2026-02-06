import Link from "next/link";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompareEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Car className="size-8 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">No vehicles to compare</h2>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Browse our vehicle lineup and add up to 4 vehicles to compare specs,
        features, and pricing side by side.
      </p>
      <Button asChild className="mt-6">
        <Link href="/vehicles">Browse Vehicles</Link>
      </Button>
    </div>
  );
}
