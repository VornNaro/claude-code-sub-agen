"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface VehicleDetailTabsProps {
  specsContent: React.ReactNode;
  featuresContent: React.ReactNode;
}

export function VehicleDetailTabs({
  specsContent,
  featuresContent,
}: VehicleDetailTabsProps) {
  return (
    <Tabs defaultValue="specs" className="w-full">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="specs" className="mt-6">
        {specsContent}
      </TabsContent>

      <TabsContent value="features" className="mt-6">
        {featuresContent}
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Reviews coming soon
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share your experience with this vehicle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
