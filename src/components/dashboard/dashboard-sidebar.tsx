"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Car,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/dashboard/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/dashboard/garage",
    label: "Garage",
    icon: Car,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

function useIsActive() {
  const pathname = usePathname();

  return (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };
}

/**
 * Horizontal scrollable tab navigation for mobile viewports.
 * Rendered above the page content in the account layout.
 */
export const DashboardMobileNav = () => {
  const isActive = useIsActive();

  return (
    <nav
      className="lg:hidden border-b bg-background/95 backdrop-blur"
      aria-label="Dashboard navigation"
    >
      <div className="flex overflow-x-auto scrollbar-none">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * Vertical sidebar navigation for desktop viewports.
 * Placed in the left column of the account layout flex container.
 */
export const DashboardDesktopSidebar = () => {
  const isActive = useIsActive();

  return (
    <aside
      className="hidden lg:block w-56 shrink-0"
      aria-label="Dashboard navigation"
    >
      <nav className="sticky top-24 space-y-1">
        {sidebarLinks.map((link, index) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <div key={link.href}>
              {index === sidebarLinks.length - 1 && (
                <Separator className="my-3" />
              )}
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
