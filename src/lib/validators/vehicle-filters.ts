import { z } from "zod";

export const vehicleFiltersSchema = z.object({
  categorySlug: z.string().optional(),
  bodyType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  fuelType: z.string().optional(),
  isNew: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "year_desc", "mileage_asc"])
    .default("newest"),
  search: z.string().optional(),
});

export type VehicleFilters = z.infer<typeof vehicleFiltersSchema>;
