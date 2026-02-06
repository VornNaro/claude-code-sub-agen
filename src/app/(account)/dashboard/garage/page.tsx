import Link from "next/link";
import { Car, Wrench } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GaragePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">My Garage</h2>
        <p className="text-sm text-muted-foreground">
          Save and track your Hyundai vehicles in one place.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary/10 p-5">
              <Car className="size-10 text-primary" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">
              No vehicles saved to your garage yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              This feature will let you save and track your Hyundai vehicles.
              Keep all your ownership details, service records, and warranty
              information organized.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/vehicles">Browse Vehicles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming features preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="size-5 text-muted-foreground" />
            <CardTitle className="text-base">Coming Soon</CardTitle>
          </div>
          <CardDescription>
            Features we are building for your garage experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Track multiple vehicles with registration and VIN details",
              "Schedule and view service history and maintenance reminders",
              "Access warranty information and coverage details",
              "Store insurance and document records digitally",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
