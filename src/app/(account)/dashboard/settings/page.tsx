"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Palette,
  ExternalLink,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

type ThemeOption = (typeof themeOptions)[number]["value"];

export default function SettingsPage() {
  // Local state for UI demonstration (not persisted)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>("system");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Account Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile, notifications, and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5 text-muted-foreground" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>
            Your profile information is managed through Clerk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Profile settings including name, email, and password are managed
              through your Clerk account.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3.5" />
                Manage Profile on Clerk
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-muted-foreground" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive account updates and alerts via email.
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="order-updates" className="text-sm font-medium">
                  Order Updates
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified about order status changes and delivery updates.
                </p>
              </div>
              <Switch
                id="order-updates"
                checked={orderUpdates}
                onCheckedChange={setOrderUpdates}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promotions" className="text-sm font-medium">
                  Promotions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive deals, discounts, and special offers.
                </p>
              </div>
              <Switch
                id="promotions"
                checked={promotions}
                onCheckedChange={setPromotions}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="price-alerts" className="text-sm font-medium">
                  Price Alerts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when vehicles in your wishlist change price.
                </p>
              </div>
              <Switch
                id="price-alerts"
                checked={priceAlerts}
                onCheckedChange={setPriceAlerts}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="size-5 text-muted-foreground" />
            <CardTitle className="text-base">Preferences</CardTitle>
          </div>
          <CardDescription>
            Customize your browsing experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <p className="mb-3 text-xs text-muted-foreground">
                Select your preferred color theme for the application.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedTheme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedTheme(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm font-medium transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
