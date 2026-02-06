export const SITE_CONFIG = {
  name: "Hyundai Motors",
  description:
    "Explore and purchase the latest Hyundai vehicles. From SUVs to electric cars, find your perfect ride.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const VEHICLE_BODY_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "truck", label: "Truck" },
  { value: "van", label: "Van" },
] as const;

export const FUEL_TYPES = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "plug-in-hybrid", label: "Plug-in Hybrid" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest" },
  { value: "mileage_asc", label: "Mileage: Lowest" },
] as const;

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 50,
} as const;
