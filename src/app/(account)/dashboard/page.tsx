"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  GitCompareArrows,
  Car,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCompareStore } from "@/stores/compare-store";

export default function DashboardPage() {
  const wishlistCount = useWishlistStore((s) => s.vehicleIds.length);
  const compareCount = useCompareStore((s) => s.vehicleIds.length);

  const stats = [
    {
      label: "Total Orders",
      value: 0,
      icon: ShoppingBag,
      href: "/dashboard/orders",
      color: "text-hyundai-blue dark:text-hyundai-active",
      bg: "bg-hyundai-blue/10 dark:bg-hyundai-active/10",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: Heart,
      href: "/dashboard/wishlist",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-600/10 dark:bg-rose-400/10",
    },
    {
      label: "Compared Vehicles",
      value: compareCount,
      icon: GitCompareArrows,
      href: "/compare",
      color: "text-hyundai-active dark:text-hyundai-active",
      bg: "bg-hyundai-active/10",
    },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-sm font-medium">
                      {stat.label}
                    </CardDescription>
                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                      <Icon className={`size-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tabular-nums">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-muted-foreground" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>
            Your latest orders, saves, and account activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Clock className="size-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              No recent activity
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              When you browse, save, or purchase vehicles, your activity will
              appear here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <Separator className="mb-4" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
            <Link href="/vehicles">
              <Car className="size-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Browse Vehicles</p>
                <p className="text-xs text-muted-foreground">
                  Explore our full lineup
                </p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
            <Link href="/dashboard/wishlist">
              <Heart className="size-5 text-rose-500" />
              <div className="text-left">
                <p className="text-sm font-medium">View Wishlist</p>
                <p className="text-xs text-muted-foreground">
                  {wishlistCount} saved vehicle{wishlistCount !== 1 ? "s" : ""}
                </p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="outline" className="h-auto justify-start gap-3 p-4" asChild>
            <Link href="/compare">
              <GitCompareArrows className="size-5 text-hyundai-active" />
              <div className="text-left">
                <p className="text-sm font-medium">Compare</p>
                <p className="text-xs text-muted-foreground">
                  {compareCount} vehicle{compareCount !== 1 ? "s" : ""} selected
                </p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
