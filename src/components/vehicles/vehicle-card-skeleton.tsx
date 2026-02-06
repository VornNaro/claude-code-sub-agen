import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VehicleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-3 w-16" />
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="h-6 w-24" />
      </CardContent>
      <CardFooter className="border-t px-4 py-3">
        <div className="flex w-full justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
      </CardFooter>
    </Card>
  );
}
