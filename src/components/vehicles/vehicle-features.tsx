import { Check, Shield, Cpu, Sofa, Gauge } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VehicleDetail } from "@/types";

interface VehicleFeaturesProps {
  features: VehicleDetail["features"];
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  Safety: {
    icon: <Shield className="h-4 w-4" />,
    label: "Safety",
  },
  Technology: {
    icon: <Cpu className="h-4 w-4" />,
    label: "Technology",
  },
  Comfort: {
    icon: <Sofa className="h-4 w-4" />,
    label: "Comfort",
  },
  Performance: {
    icon: <Gauge className="h-4 w-4" />,
    label: "Performance",
  },
};

function getCategoryConfig(category: string) {
  return (
    CATEGORY_CONFIG[category] ?? {
      icon: <Check className="h-4 w-4" />,
      label: category,
    }
  );
}

export function VehicleFeatures({ features }: VehicleFeaturesProps) {
  if (!features || features.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No features listed for this vehicle.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group features by category
  const grouped = features.reduce<Record<string, typeof features>>(
    (acc, feature) => {
      const cat = feature.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(feature);
      return acc;
    },
    {},
  );

  // Sort categories: known categories first in order, then any extras alphabetically
  const knownOrder = ["Safety", "Technology", "Comfort", "Performance"];
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const aIndex = knownOrder.indexOf(a);
    const bIndex = knownOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Features</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={sortedCategories}
          className="w-full"
        >
          {sortedCategories.map((category) => {
            const config = getCategoryConfig(category);
            const categoryFeatures = grouped[category];

            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="text-primary">{config.icon}</span>
                    {config.label}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({categoryFeatures.length})
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-2 sm:grid-cols-2" role="list">
                    {categoryFeatures.map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-hyundai-success" />
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {feature.name}
                          </span>
                          {feature.description && (
                            <p className="text-xs text-muted-foreground">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
