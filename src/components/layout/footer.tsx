import Link from "next/link";
import { Car } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  vehicles: [
    { href: "/vehicles?bodyType=suv", label: "SUVs" },
    { href: "/vehicles?bodyType=sedan", label: "Sedans" },
    { href: "/vehicles?bodyType=electric", label: "Electric" },
    { href: "/vehicles?bodyType=hybrid", label: "Hybrid" },
    { href: "/vehicles?bodyType=truck", label: "Trucks" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/news", label: "News" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/financing", label: "Financing" },
    { href: "/warranty", label: "Warranty" },
    { href: "/service", label: "Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">
                Hyundai Motors
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Explore the latest Hyundai vehicles. Innovation that moves you.
            </p>
          </div>

          {/* Vehicles */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Vehicles</h3>
            <ul className="space-y-2">
              {footerLinks.vehicles.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Hyundai Motors. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
