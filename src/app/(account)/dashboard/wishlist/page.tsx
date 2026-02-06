"use client";

import Link from "next/link";
import { Heart, Trash2, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function WishlistPage() {
  const vehicleIds = useWishlistStore((s) => s.vehicleIds);
  const removeVehicle = useWishlistStore((s) => s.removeVehicle);
  const clearAll = useWishlistStore((s) => s.clearAll);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Wishlist</h2>
          <p className="text-sm text-muted-foreground">
            Vehicles you have saved for later.
          </p>
        </div>
        {vehicleIds.length > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {vehicleIds.length} item{vehicleIds.length !== 1 ? "s" : ""}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>

      {vehicleIds.length === 0 ? (
        /* Empty state */
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-rose-100 p-5 dark:bg-rose-500/10">
                <Heart className="size-10 text-rose-500" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                Your wishlist is empty
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Save vehicles you are interested in by clicking the heart icon
                on any vehicle card. They will appear here for easy access.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/vehicles">Browse Vehicles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Wishlist items */
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicleIds.map((id) => (
            <Card key={id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm">Vehicle</CardTitle>
                    <CardDescription className="mt-1 font-mono text-xs">
                      ID: {id}
                    </CardDescription>
                  </div>
                  <Heart className="size-4 fill-rose-500 text-rose-500" />
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/vehicles/${id}`}>
                      <ExternalLink className="size-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicle(id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Browse link when list has items */}
      {vehicleIds.length > 0 && (
        <div className="text-center">
          <Button variant="link" asChild>
            <Link href="/vehicles">Browse more vehicles</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
