import Link from "next/link";
import { ArrowRight, Car, Zap, Shield, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const categories = [
  { name: "SUVs", slug: "suv", icon: Car, count: "12+" },
  { name: "Electric", slug: "electric", icon: Zap, count: "8+" },
  { name: "Sedans", slug: "sedan", icon: Car, count: "10+" },
  { name: "Hybrid", slug: "hybrid", icon: Zap, count: "6+" },
];

const features = [
  {
    icon: Shield,
    title: "Certified Quality",
    description: "Every vehicle undergoes a comprehensive inspection.",
  },
  {
    icon: Wrench,
    title: "Full Service History",
    description: "Complete maintenance records for every listing.",
  },
  {
    icon: Zap,
    title: "Latest Models",
    description: "Browse the newest Hyundai models including Ioniq lineup.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary py-24 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Find Your Perfect
              <span className="block text-accent">Hyundai</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
              Explore our complete lineup of vehicles. From the all-electric
              Ioniq family to the versatile Tucson and Santa Fe.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/vehicles">
                  Browse All Vehicles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/vehicles?bodyType=electric">
                  Explore Electric
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Browse by Category</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
            Find the perfect vehicle for your lifestyle
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/vehicles?bodyType=${cat.slug}`}
              >
                <Card className="group transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <cat.icon className="mb-3 h-10 w-10 text-primary transition-colors group-hover:text-accent" />
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.count} vehicles
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold">
              Why Choose Hyundai Motors
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to Find Your Ride?</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Browse our full inventory with infinite scroll. Filter by type,
            price, year, and more.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/vehicles">
              View All Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
