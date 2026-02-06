import Link from "next/link";
import { Car } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { HeaderActions } from "./header-actions";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { href: "/vehicles", label: "All Vehicles" },
  { href: "/vehicles?bodyType=suv", label: "SUVs" },
  { href: "/vehicles?bodyType=sedan", label: "Sedans" },
  { href: "/vehicles?bodyType=electric", label: "Electric" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <HeaderActions />
          <div className="lg:hidden">
            <MobileNav links={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
