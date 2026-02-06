import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
import {
  categories,
  vehicles,
  vehicleImages,
  vehicleFeatures,
} from "./schema";

// ---------------------------------------------------------------------------
// Helper: UUID generation using Node built-in crypto
// ---------------------------------------------------------------------------
function genId(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Database connection (standalone -- does not rely on the lazy proxy)
// ---------------------------------------------------------------------------
function createSeedDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Make sure your .env file exists and contains DATABASE_URL.",
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

// ---------------------------------------------------------------------------
// Category seed data
// ---------------------------------------------------------------------------
interface CategorySeed {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

function buildCategories(): CategorySeed[] {
  return [
    {
      id: genId(),
      name: "SUV",
      slug: "suv",
      description:
        "Versatile Sport Utility Vehicles built for adventure, family trips, and everything in between.",
      imageUrl: "https://placehold.co/400x300/002C5F/00AAD2?text=SUV",
      sortOrder: 1,
    },
    {
      id: genId(),
      name: "Sedan",
      slug: "sedan",
      description:
        "Refined sedans combining elegant design with efficient performance for everyday driving.",
      imageUrl: "https://placehold.co/400x300/002C5F/00AAD2?text=Sedan",
      sortOrder: 2,
    },
    {
      id: genId(),
      name: "Hatchback",
      slug: "hatchback",
      description:
        "Sporty hatchbacks delivering thrilling performance in a compact, practical package.",
      imageUrl: "https://placehold.co/400x300/002C5F/00AAD2?text=Hatchback",
      sortOrder: 3,
    },
    {
      id: genId(),
      name: "Electric",
      slug: "electric",
      description:
        "Zero-emission electric vehicles powered by cutting-edge technology and sustainable engineering.",
      imageUrl: "https://placehold.co/400x300/002C5F/00AAD2?text=Electric",
      sortOrder: 4,
    },
    {
      id: genId(),
      name: "Hybrid",
      slug: "hybrid",
      description:
        "Hybrid vehicles blending gasoline and electric power for outstanding fuel economy.",
      imageUrl: "https://placehold.co/400x300/002C5F/00AAD2?text=Hybrid",
      sortOrder: 5,
    },
    {
      id: genId(),
      name: "Truck",
      slug: "truck",
      description:
        "Capable trucks designed for work and play with impressive towing and payload capacity.",
      imageUrl: "https://placehold.co/400x300/002C5F/00AAD2?text=Truck",
      sortOrder: 6,
    },
  ];
}

// ---------------------------------------------------------------------------
// Vehicle seed data
// ---------------------------------------------------------------------------
interface VehicleSeed {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categorySlug: string; // resolved to categoryId during insert
  bodyType: "sedan" | "suv" | "hatchback" | "electric" | "hybrid" | "truck";
  year: number;
  price: string;
  msrp: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  engineSize: string;
  horsepower: number;
  seatingCapacity: number;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  status: "available";
  isFeatured: boolean;
  isNew: boolean;
  specs: Record<string, unknown>;
}

function buildVehicles(): VehicleSeed[] {
  return [
    // ── SUVs ──────────────────────────────────────────────────────────────
    {
      id: genId(),
      name: "Hyundai Tucson 2025",
      slug: "hyundai-tucson-2025",
      description:
        "The 2025 Hyundai Tucson redefines the compact SUV segment with its bold parametric design, spacious interior, and advanced safety suite. Equipped with a 2.5L 4-cylinder engine producing 187 hp, it delivers a perfect balance of power and efficiency. Standard features include an 8-inch touchscreen, wireless Apple CarPlay and Android Auto, and Hyundai SmartSense safety technologies.",
      shortDescription:
        "Bold compact SUV with parametric design, 187 hp, and advanced SmartSense safety.",
      categorySlug: "suv",
      bodyType: "suv",
      year: 2025,
      price: "30950.00",
      msrp: "30950.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "8-Speed Automatic",
      engineSize: "2.5L 4-Cylinder",
      horsepower: 187,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Phantom Black",
      interiorColor: "Black",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        mpgCity: 26,
        mpgHighway: 33,
        mpgCombined: 29,
        curbWeight: "3649 lbs",
        cargoVolume: "38.7 cu ft",
        towingCapacity: "2000 lbs",
        wheelbase: "108.3 in",
        length: "182.3 in",
        width: "73.4 in",
        height: "66.1 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Santa Fe 2025",
      slug: "hyundai-santa-fe-2025",
      description:
        "The 2025 Hyundai Santa Fe is a mid-size SUV that embraces a rugged, boxy aesthetic inspired by outdoor adventure. Its completely redesigned exterior features a full-width LED light bar and an elongated roofline. Inside, a dual 12.3-inch display setup and premium materials create a high-tech, comfortable cabin for up to 7 passengers.",
      shortDescription:
        "Redesigned mid-size SUV with rugged styling, 7 seats, and dual 12.3-inch displays.",
      categorySlug: "suv",
      bodyType: "suv",
      year: 2025,
      price: "38585.00",
      msrp: "38585.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "8-Speed Automatic",
      engineSize: "2.5L Turbo 4-Cylinder",
      horsepower: 277,
      seatingCapacity: 7,
      drivetrain: "AWD",
      exteriorColor: "Serenity White Pearl",
      interiorColor: "Dark Beige",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        mpgCity: 22,
        mpgHighway: 28,
        mpgCombined: 25,
        curbWeight: "4192 lbs",
        cargoVolume: "75.5 cu ft",
        towingCapacity: "3500 lbs",
        wheelbase: "114.2 in",
        length: "191.1 in",
        width: "77.0 in",
        height: "68.9 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Palisade 2025",
      slug: "hyundai-palisade-2025",
      description:
        "The 2025 Hyundai Palisade stands as the flagship SUV in the Hyundai lineup. With its commanding presence, premium cabin crafted with quilted Nappa leather, and a powerful 3.8L V6 engine, the Palisade offers luxury-level refinement. Its three-row seating comfortably accommodates 8 passengers with class-leading legroom.",
      shortDescription:
        "Flagship 8-passenger SUV with 3.8L V6, Nappa leather, and luxury-level refinement.",
      categorySlug: "suv",
      bodyType: "suv",
      year: 2025,
      price: "38550.00",
      msrp: "38550.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "8-Speed Automatic",
      engineSize: "3.8L V6",
      horsepower: 291,
      seatingCapacity: 8,
      drivetrain: "FWD",
      exteriorColor: "Hyper White",
      interiorColor: "Navy",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        mpgCity: 19,
        mpgHighway: 26,
        mpgCombined: 22,
        curbWeight: "4327 lbs",
        cargoVolume: "86.4 cu ft",
        towingCapacity: "5000 lbs",
        wheelbase: "114.2 in",
        length: "196.1 in",
        width: "77.8 in",
        height: "68.9 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Kona 2025",
      slug: "hyundai-kona-2025",
      description:
        "The 2025 Hyundai Kona is a subcompact SUV that punches above its weight with a completely redesigned, angular exterior and a tech-forward interior. A 2.0L 4-cylinder engine provides 147 hp of efficient motivation. The Kona is ideal for urban commuters who want SUV versatility without the bulk.",
      shortDescription:
        "Stylish subcompact SUV with angular design, 147 hp, and urban-friendly dimensions.",
      categorySlug: "suv",
      bodyType: "suv",
      year: 2025,
      price: "24650.00",
      msrp: "24650.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "CVT",
      engineSize: "2.0L 4-Cylinder",
      horsepower: 147,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Ecotronic Gray Pearl",
      interiorColor: "Black",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 30,
        mpgHighway: 35,
        mpgCombined: 32,
        curbWeight: "3120 lbs",
        cargoVolume: "27.0 cu ft",
        towingCapacity: "N/A",
        wheelbase: "104.3 in",
        length: "173.0 in",
        width: "72.0 in",
        height: "63.0 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Venue 2025",
      slug: "hyundai-venue-2025",
      description:
        "The 2025 Hyundai Venue is the most affordable entry into the Hyundai SUV family. Despite its compact dimensions, it offers a surprisingly spacious interior, an 8-inch touchscreen with wireless connectivity, and a peppy 1.6L engine. Perfect for first-time buyers and city dwellers seeking an elevated driving position.",
      shortDescription:
        "Affordable entry SUV with 8-inch touchscreen and city-friendly compact dimensions.",
      categorySlug: "suv",
      bodyType: "suv",
      year: 2025,
      price: "20875.00",
      msrp: "20875.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "CVT",
      engineSize: "1.6L 4-Cylinder",
      horsepower: 121,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Denim Blue",
      interiorColor: "Black",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 30,
        mpgHighway: 38,
        mpgCombined: 33,
        curbWeight: "2744 lbs",
        cargoVolume: "18.7 cu ft",
        towingCapacity: "N/A",
        wheelbase: "99.2 in",
        length: "159.1 in",
        width: "69.9 in",
        height: "63.0 in",
      },
    },

    // ── Sedans ────────────────────────────────────────────────────────────
    {
      id: genId(),
      name: "Hyundai Sonata 2025",
      slug: "hyundai-sonata-2025",
      description:
        "The 2025 Hyundai Sonata is a mid-size sedan that combines stunning coupe-like styling with a generous interior. Its 1.6L turbocharged engine delivers 180 hp and 195 lb-ft of torque through a smooth 8-speed automatic. With a 12.3-inch digital instrument cluster and a suite of driver-assistance features, the Sonata is a compelling choice for those seeking style and substance.",
      shortDescription:
        "Coupe-styled mid-size sedan with 1.6L turbo, 180 hp, and 12.3-inch digital cluster.",
      categorySlug: "sedan",
      bodyType: "sedan",
      year: 2025,
      price: "28950.00",
      msrp: "28950.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "8-Speed Automatic",
      engineSize: "1.6L Turbo 4-Cylinder",
      horsepower: 180,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Nocturne Gray",
      interiorColor: "Black",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        mpgCity: 27,
        mpgHighway: 37,
        mpgCombined: 31,
        curbWeight: "3330 lbs",
        trunkVolume: "16.3 cu ft",
        wheelbase: "111.8 in",
        length: "192.9 in",
        width: "73.2 in",
        height: "56.9 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Elantra 2025",
      slug: "hyundai-elantra-2025",
      description:
        "The 2025 Hyundai Elantra is a compact sedan with bold, origami-inspired exterior styling that turns heads everywhere it goes. Its 2.0L engine provides 147 hp and achieves up to 37 mpg on the highway. Standard wireless Apple CarPlay and Android Auto, combined with a comprehensive safety package, make it one of the best values in the compact segment.",
      shortDescription:
        "Bold compact sedan with origami design, 147 hp, and up to 37 mpg highway.",
      categorySlug: "sedan",
      bodyType: "sedan",
      year: 2025,
      price: "23200.00",
      msrp: "23200.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "CVT",
      engineSize: "2.0L 4-Cylinder",
      horsepower: 147,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Intense Blue",
      interiorColor: "Gray",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 31,
        mpgHighway: 41,
        mpgCombined: 35,
        curbWeight: "2946 lbs",
        trunkVolume: "14.2 cu ft",
        wheelbase: "107.1 in",
        length: "184.1 in",
        width: "71.9 in",
        height: "55.7 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Accent 2025",
      slug: "hyundai-accent-2025",
      description:
        "The 2025 Hyundai Accent is the budget-friendly sedan offering exceptional value without compromising on essential features. Its 1.6L engine is mated to a CVT for smooth, efficient power delivery. With Hyundai SmartSense standard safety features and an intuitive infotainment system, the Accent proves that affordability and quality can coexist.",
      shortDescription:
        "Budget-friendly sedan with 1.6L engine, SmartSense safety, and excellent fuel economy.",
      categorySlug: "sedan",
      bodyType: "sedan",
      year: 2025,
      price: "19550.00",
      msrp: "19550.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "CVT",
      engineSize: "1.6L 4-Cylinder",
      horsepower: 120,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Admiral Blue Pearl",
      interiorColor: "Gray",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 33,
        mpgHighway: 41,
        mpgCombined: 36,
        curbWeight: "2679 lbs",
        trunkVolume: "13.7 cu ft",
        wheelbase: "102.4 in",
        length: "172.6 in",
        width: "67.7 in",
        height: "57.1 in",
      },
    },

    // ── Electric ──────────────────────────────────────────────────────────
    {
      id: genId(),
      name: "Hyundai Ioniq 5 2025",
      slug: "hyundai-ioniq-5-2025",
      description:
        "The 2025 Hyundai Ioniq 5 is an award-winning electric crossover built on the dedicated E-GMP platform. With up to 303 miles of range, ultra-fast 800V charging capability (10% to 80% in just 18 minutes), and a retro-futuristic design inspired by the 1975 Pony concept, it is a revolutionary EV. Vehicle-to-Load (V2L) technology lets you power external devices directly from the car.",
      shortDescription:
        "Award-winning electric crossover with 303-mile range and 800V ultra-fast charging.",
      categorySlug: "electric",
      bodyType: "electric",
      year: 2025,
      price: "44850.00",
      msrp: "44850.00",
      mileage: 0,
      fuelType: "Electric",
      transmission: "Single-Speed Reduction",
      engineSize: "77.4 kWh Battery",
      horsepower: 320,
      seatingCapacity: 5,
      drivetrain: "AWD",
      exteriorColor: "Atlas White",
      interiorColor: "Dark Pebble Gray",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        range: "303 miles",
        batteryCapacity: "77.4 kWh",
        chargingTime10to80: "18 min (350 kW DC)",
        mpge: "114 MPGe",
        peakTorque: "446 lb-ft",
        curbWeight: "4431 lbs",
        cargoVolume: "27.2 cu ft",
        wheelbase: "118.1 in",
        length: "182.5 in",
        width: "74.4 in",
        height: "63.2 in",
        v2l: true,
      },
    },
    {
      id: genId(),
      name: "Hyundai Ioniq 6 2025",
      slug: "hyundai-ioniq-6-2025",
      description:
        "The 2025 Hyundai Ioniq 6 is a sleek electric sedan with a stunning 0.21 drag coefficient, one of the lowest of any production car. Built on the E-GMP platform, it offers up to 361 miles of range and the same 800V ultra-fast charging as its sibling. Its streamlined silhouette and pixel-inspired LED lighting create an unmistakable design identity on the road.",
      shortDescription:
        "Aerodynamic electric sedan with 361-mile range and industry-leading 0.21 Cd.",
      categorySlug: "electric",
      bodyType: "electric",
      year: 2025,
      price: "44500.00",
      msrp: "44500.00",
      mileage: 0,
      fuelType: "Electric",
      transmission: "Single-Speed Reduction",
      engineSize: "77.4 kWh Battery",
      horsepower: 320,
      seatingCapacity: 5,
      drivetrain: "AWD",
      exteriorColor: "Biophilic Blue Pearl",
      interiorColor: "Light Gray",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        range: "361 miles",
        batteryCapacity: "77.4 kWh",
        chargingTime10to80: "18 min (350 kW DC)",
        mpge: "140 MPGe",
        dragCoefficient: 0.21,
        peakTorque: "446 lb-ft",
        curbWeight: "4410 lbs",
        trunkVolume: "11.3 cu ft",
        wheelbase: "116.1 in",
        length: "191.0 in",
        width: "73.6 in",
        height: "58.8 in",
        v2l: true,
      },
    },
    {
      id: genId(),
      name: "Hyundai Ioniq 9 2025",
      slug: "hyundai-ioniq-9-2025",
      description:
        "The 2025 Hyundai Ioniq 9 is a full-size electric SUV that seats up to 7 passengers in first-class comfort. As the largest member of the Ioniq family, it features a massive 110.3 kWh battery for over 350 miles of range, swivel second-row seats, and a lounge-like interior with sustainable materials. The Ioniq 9 represents the future of family transportation.",
      shortDescription:
        "Full-size electric 7-seat SUV with 350+ mile range and first-class lounge interior.",
      categorySlug: "electric",
      bodyType: "electric",
      year: 2025,
      price: "56750.00",
      msrp: "56750.00",
      mileage: 0,
      fuelType: "Electric",
      transmission: "Single-Speed Reduction",
      engineSize: "110.3 kWh Battery",
      horsepower: 380,
      seatingCapacity: 7,
      drivetrain: "AWD",
      exteriorColor: "Celadon Gray Matte",
      interiorColor: "Light Beige",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        range: "350+ miles",
        batteryCapacity: "110.3 kWh",
        chargingTime10to80: "24 min (350 kW DC)",
        mpge: "105 MPGe (est.)",
        peakTorque: "516 lb-ft",
        curbWeight: "5800 lbs (est.)",
        cargoVolume: "88 cu ft (est.)",
        wheelbase: "124.0 in",
        length: "201.0 in",
        width: "78.0 in",
        height: "70.1 in",
        v2l: true,
        swivelSeats: true,
      },
    },
    {
      id: genId(),
      name: "Hyundai Kona Electric 2025",
      slug: "hyundai-kona-electric-2025",
      description:
        "The 2025 Hyundai Kona Electric is the electrified version of the popular subcompact SUV. It offers up to 261 miles of range from a 64.8 kWh battery, making it an ideal urban commuter with zero emissions. Fast-charging capability adds 80% charge in approximately 43 minutes at a 100 kW DC station.",
      shortDescription:
        "Electric subcompact SUV with 261-mile range and fast-charging capability.",
      categorySlug: "electric",
      bodyType: "electric",
      year: 2025,
      price: "34450.00",
      msrp: "34450.00",
      mileage: 0,
      fuelType: "Electric",
      transmission: "Single-Speed Reduction",
      engineSize: "64.8 kWh Battery",
      horsepower: 201,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Cyber Gray Metallic",
      interiorColor: "Black",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        range: "261 miles",
        batteryCapacity: "64.8 kWh",
        chargingTime10to80: "43 min (100 kW DC)",
        mpge: "132 MPGe",
        peakTorque: "255 lb-ft",
        curbWeight: "3715 lbs",
        cargoVolume: "27.0 cu ft",
        wheelbase: "104.3 in",
        length: "173.0 in",
        width: "72.0 in",
        height: "63.0 in",
      },
    },

    // ── Hybrid ────────────────────────────────────────────────────────────
    {
      id: genId(),
      name: "Hyundai Tucson Hybrid 2025",
      slug: "hyundai-tucson-hybrid-2025",
      description:
        "The 2025 Hyundai Tucson Hybrid pairs a 1.6L turbocharged engine with an electric motor for a combined 232 hp. With up to 38 mpg combined, it offers remarkable efficiency without sacrificing the Tucson's bold design or spacious interior. Standard Hyundai SmartSense safety technologies keep you protected on every drive.",
      shortDescription:
        "Hybrid compact SUV with 232 hp, up to 38 mpg combined, and SmartSense safety.",
      categorySlug: "hybrid",
      bodyType: "hybrid",
      year: 2025,
      price: "35275.00",
      msrp: "35275.00",
      mileage: 0,
      fuelType: "Hybrid",
      transmission: "6-Speed Automatic",
      engineSize: "1.6L Turbo Hybrid",
      horsepower: 232,
      seatingCapacity: 5,
      drivetrain: "AWD",
      exteriorColor: "Shimmering Silver",
      interiorColor: "Black",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 38,
        mpgHighway: 38,
        mpgCombined: 38,
        systemOutput: "232 hp",
        electricMotor: "44.2 kW",
        batteryType: "1.49 kWh Lithium-ion",
        curbWeight: "3825 lbs",
        cargoVolume: "38.7 cu ft",
        wheelbase: "108.3 in",
        length: "182.3 in",
        width: "73.4 in",
        height: "66.1 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Santa Fe Hybrid 2025",
      slug: "hyundai-santa-fe-hybrid-2025",
      description:
        "The 2025 Hyundai Santa Fe Hybrid brings electrified efficiency to the redesigned mid-size SUV. Its 1.6L turbo hybrid powertrain delivers 232 hp and an impressive 36 mpg combined. With available third-row seating and the bold new exterior design, it is perfect for eco-conscious families who need space and capability.",
      shortDescription:
        "Hybrid mid-size SUV with 232 hp, 36 mpg combined, and available third-row seating.",
      categorySlug: "hybrid",
      bodyType: "hybrid",
      year: 2025,
      price: "42250.00",
      msrp: "42250.00",
      mileage: 0,
      fuelType: "Hybrid",
      transmission: "6-Speed Automatic",
      engineSize: "1.6L Turbo Hybrid",
      horsepower: 232,
      seatingCapacity: 7,
      drivetrain: "AWD",
      exteriorColor: "Earthy Brass",
      interiorColor: "Terracotta",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 36,
        mpgHighway: 36,
        mpgCombined: 36,
        systemOutput: "232 hp",
        electricMotor: "44.2 kW",
        batteryType: "1.49 kWh Lithium-ion",
        curbWeight: "4350 lbs",
        cargoVolume: "75.5 cu ft",
        wheelbase: "114.2 in",
        length: "191.1 in",
        width: "77.0 in",
        height: "68.9 in",
      },
    },
    {
      id: genId(),
      name: "Hyundai Sonata Hybrid 2025",
      slug: "hyundai-sonata-hybrid-2025",
      description:
        "The 2025 Hyundai Sonata Hybrid combines the Sonata's elegant coupe-like styling with a 2.0L hybrid powertrain producing 192 hp and up to 52 mpg on the highway. An available solar roof panel system helps charge the battery while parked, extending efficiency even further. It is one of the most fuel-efficient mid-size sedans on the market.",
      shortDescription:
        "Hybrid mid-size sedan with 192 hp, up to 52 mpg highway, and available solar roof.",
      categorySlug: "hybrid",
      bodyType: "hybrid",
      year: 2025,
      price: "32950.00",
      msrp: "32950.00",
      mileage: 0,
      fuelType: "Hybrid",
      transmission: "6-Speed Automatic",
      engineSize: "2.0L Hybrid",
      horsepower: 192,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Midnight Black Pearl",
      interiorColor: "Camel Beige",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 45,
        mpgHighway: 52,
        mpgCombined: 47,
        systemOutput: "192 hp",
        electricMotor: "38 kW",
        batteryType: "1.76 kWh Lithium-ion Polymer",
        curbWeight: "3428 lbs",
        trunkVolume: "16.3 cu ft",
        wheelbase: "111.8 in",
        length: "192.9 in",
        width: "73.2 in",
        height: "56.9 in",
        solarRoofAvailable: true,
      },
    },
    {
      id: genId(),
      name: "Hyundai Elantra Hybrid 2025",
      slug: "hyundai-elantra-hybrid-2025",
      description:
        "The 2025 Hyundai Elantra Hybrid takes the bold Elantra design and adds a 1.6L hybrid powertrain delivering 139 hp and an outstanding 54 mpg combined. It is one of the most fuel-efficient compact sedans available, providing significant fuel savings over thousands of miles without sacrificing style or technology.",
      shortDescription:
        "Hybrid compact sedan with 139 hp, outstanding 54 mpg combined, and bold styling.",
      categorySlug: "hybrid",
      bodyType: "hybrid",
      year: 2025,
      price: "26600.00",
      msrp: "26600.00",
      mileage: 0,
      fuelType: "Hybrid",
      transmission: "6-Speed DCT",
      engineSize: "1.6L Hybrid",
      horsepower: 139,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Amazon Gray",
      interiorColor: "Light Gray",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 53,
        mpgHighway: 56,
        mpgCombined: 54,
        systemOutput: "139 hp",
        electricMotor: "32 kW",
        batteryType: "1.32 kWh Lithium-ion Polymer",
        curbWeight: "3064 lbs",
        trunkVolume: "14.2 cu ft",
        wheelbase: "107.1 in",
        length: "184.1 in",
        width: "71.9 in",
        height: "55.7 in",
      },
    },

    // ── Hatchback ─────────────────────────────────────────────────────────
    {
      id: genId(),
      name: "Hyundai Elantra N 2025",
      slug: "hyundai-elantra-n-2025",
      description:
        "The 2025 Hyundai Elantra N is a high-performance compact sedan-hatchback built by Hyundai's N performance division. Its 2.0L turbocharged engine produces 276 hp and 289 lb-ft of torque, channeled through an available 6-speed manual or an 8-speed wet DCT with N Grin Shift boost. Track-ready features include launch control, N Corner Carving Differential, and an electronically controlled limited-slip differential.",
      shortDescription:
        "High-performance compact with 276 hp turbo, available manual, and track-ready tech.",
      categorySlug: "hatchback",
      bodyType: "hatchback",
      year: 2025,
      price: "34615.00",
      msrp: "34615.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "6-Speed Manual",
      engineSize: "2.0L Turbo 4-Cylinder",
      horsepower: 276,
      seatingCapacity: 5,
      drivetrain: "FWD",
      exteriorColor: "Performance Blue",
      interiorColor: "Black / Performance Blue",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        mpgCity: 22,
        mpgHighway: 31,
        mpgCombined: 25,
        torque: "289 lb-ft",
        zeroToSixty: "5.0 sec",
        topSpeed: "161 mph",
        curbWeight: "3340 lbs",
        trunkVolume: "14.2 cu ft",
        wheelbase: "107.1 in",
        length: "184.1 in",
        width: "71.9 in",
        height: "55.7 in",
        launchControl: true,
        eLSD: true,
        nGrinShift: true,
      },
    },
    {
      id: genId(),
      name: "Hyundai Veloster N 2025",
      slug: "hyundai-veloster-n-2025",
      description:
        "The 2025 Hyundai Veloster N carries forward the spirit of the iconic asymmetric hatchback with even more power and refinement. Its 2.0L turbocharged engine now produces 275 hp, paired with either a 6-speed manual or the thrilling 8-speed wet DCT. The unique three-door layout (2 passenger-side doors, 1 driver-side) gives it unmistakable character on the road.",
      shortDescription:
        "Iconic asymmetric hatchback with 275 hp turbo and unique three-door design.",
      categorySlug: "hatchback",
      bodyType: "hatchback",
      year: 2025,
      price: "33750.00",
      msrp: "33750.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "8-Speed DCT",
      engineSize: "2.0L Turbo 4-Cylinder",
      horsepower: 275,
      seatingCapacity: 4,
      drivetrain: "FWD",
      exteriorColor: "Racing Red",
      interiorColor: "Black / Red",
      status: "available",
      isFeatured: false,
      isNew: true,
      specs: {
        mpgCity: 22,
        mpgHighway: 29,
        mpgCombined: 25,
        torque: "260 lb-ft",
        zeroToSixty: "5.2 sec",
        topSpeed: "155 mph",
        curbWeight: "3130 lbs",
        cargoVolume: "19.9 cu ft",
        wheelbase: "104.3 in",
        length: "167.0 in",
        width: "70.9 in",
        height: "55.7 in",
        launchControl: true,
        eLSD: true,
        nGrinShift: true,
        asymmetricDoors: true,
      },
    },

    // ── Truck ─────────────────────────────────────────────────────────────
    {
      id: genId(),
      name: "Hyundai Santa Cruz 2025",
      slug: "hyundai-santa-cruz-2025",
      description:
        "The 2025 Hyundai Santa Cruz is a Sport Adventure Vehicle that blends the comfort of an SUV with the utility of a pickup truck. Its 2.5L turbocharged engine produces 281 hp, and the innovative lockable bed with a retractable tonneau cover provides versatile cargo solutions. With a unibody construction, it drives like a crossover while hauling like a truck.",
      shortDescription:
        "Sport Adventure Vehicle with 281 hp turbo, lockable bed, and crossover comfort.",
      categorySlug: "truck",
      bodyType: "truck",
      year: 2025,
      price: "29865.00",
      msrp: "29865.00",
      mileage: 0,
      fuelType: "Gasoline",
      transmission: "8-Speed DCT",
      engineSize: "2.5L Turbo 4-Cylinder",
      horsepower: 281,
      seatingCapacity: 5,
      drivetrain: "AWD",
      exteriorColor: "Hampton Gray",
      interiorColor: "Black",
      status: "available",
      isFeatured: true,
      isNew: true,
      specs: {
        mpgCity: 19,
        mpgHighway: 27,
        mpgCombined: 22,
        torque: "311 lb-ft",
        towingCapacity: "5000 lbs",
        payloadCapacity: "1748 lbs",
        bedLength: "52.1 in",
        curbWeight: "4018 lbs",
        wheelbase: "118.3 in",
        length: "195.7 in",
        width: "75.0 in",
        height: "66.7 in",
        lockableBed: true,
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Feature templates per vehicle type
// ---------------------------------------------------------------------------
interface FeatureTemplate {
  category: string;
  name: string;
  description: string;
}

const safetyFeatures: FeatureTemplate[] = [
  {
    category: "Safety",
    name: "Forward Collision-Avoidance Assist",
    description:
      "Detects vehicles, pedestrians, and cyclists ahead and applies emergency braking if necessary.",
  },
  {
    category: "Safety",
    name: "Blind-Spot Collision-Avoidance Assist",
    description:
      "Monitors blind spots and applies corrective steering or braking to help avoid lane-change collisions.",
  },
  {
    category: "Safety",
    name: "Lane Keeping Assist",
    description:
      "Provides steering torque to help keep the vehicle centered in its lane on the highway.",
  },
  {
    category: "Safety",
    name: "Rear Cross-Traffic Collision-Avoidance Assist",
    description:
      "Detects vehicles approaching from the side while reversing and alerts the driver or applies brakes.",
  },
  {
    category: "Safety",
    name: "Highway Driving Assist II",
    description:
      "Semi-autonomous highway driving with lane centering, adaptive cruise, and hands-on detection.",
  },
];

const technologyFeatures: FeatureTemplate[] = [
  {
    category: "Technology",
    name: "12.3-inch Touchscreen Infotainment",
    description:
      "High-resolution touchscreen with wireless Apple CarPlay and Android Auto connectivity.",
  },
  {
    category: "Technology",
    name: "12.3-inch Digital Instrument Cluster",
    description:
      "Fully configurable digital gauge cluster displaying navigation, driving data, and media information.",
  },
  {
    category: "Technology",
    name: "Bose Premium Sound System",
    description:
      "Premium audio system with strategically placed speakers for an immersive listening experience.",
  },
  {
    category: "Technology",
    name: "Wireless Charging Pad",
    description:
      "Qi-compatible wireless smartphone charging pad integrated into the center console.",
  },
  {
    category: "Technology",
    name: "Digital Key 2.0",
    description:
      "Use your NFC-enabled smartphone or smartwatch as a vehicle key for locking, unlocking, and starting.",
  },
];

const comfortFeatures: FeatureTemplate[] = [
  {
    category: "Comfort",
    name: "Dual-Zone Automatic Climate Control",
    description:
      "Independent temperature settings for driver and passenger with auto defog and fine dust indicator.",
  },
  {
    category: "Comfort",
    name: "Heated and Ventilated Front Seats",
    description:
      "Three-level heating and ventilation for front seats to maintain comfort in all seasons.",
  },
  {
    category: "Comfort",
    name: "Panoramic Sunroof",
    description:
      "Full-length glass sunroof with tilt and slide functionality, flooding the cabin with natural light.",
  },
  {
    category: "Comfort",
    name: "Power Liftgate with Auto Open",
    description:
      "Hands-free power liftgate that opens automatically when the smart key is detected nearby.",
  },
  {
    category: "Comfort",
    name: "Leather-Wrapped Steering Wheel",
    description:
      "Heated, leather-wrapped steering wheel with integrated audio and cruise control buttons.",
  },
];

const performanceFeatures: FeatureTemplate[] = [
  {
    category: "Performance",
    name: "Drive Mode Select",
    description:
      "Choose between Eco, Normal, Sport, and Smart drive modes to tailor throttle response and steering feel.",
  },
  {
    category: "Performance",
    name: "Multi-Link Rear Suspension",
    description:
      "Independent multi-link rear suspension for a composed ride and confident handling.",
  },
  {
    category: "Performance",
    name: "HTRAC All-Wheel Drive",
    description:
      "Hyundai's intelligent AWD system that distributes torque between front and rear axles for optimal traction.",
  },
  {
    category: "Performance",
    name: "Electronically Controlled Suspension",
    description:
      "Adaptive suspension that continuously adjusts damping force based on road conditions and driving style.",
  },
  {
    category: "Performance",
    name: "Integrated Drive Axle (IDA)",
    description:
      "Compact drive unit integrating motor, inverter, and reducer for efficient power delivery in EVs.",
  },
];

const electricSpecificFeatures: FeatureTemplate[] = [
  {
    category: "Technology",
    name: "Vehicle-to-Load (V2L)",
    description:
      "Power external devices and appliances using the vehicle's battery with up to 3.6 kW output.",
  },
  {
    category: "Technology",
    name: "800V Ultra-Fast Charging",
    description:
      "Industry-leading 800V architecture enables 10-80% charge in as little as 18 minutes.",
  },
  {
    category: "Performance",
    name: "Regenerative Braking with i-Pedal",
    description:
      "Adjustable regenerative braking with i-Pedal mode for one-pedal driving in traffic.",
  },
];

const nPerformanceFeatures: FeatureTemplate[] = [
  {
    category: "Performance",
    name: "N Grin Shift",
    description:
      "Temporary 10-second overboost function providing maximum power at the push of a button.",
  },
  {
    category: "Performance",
    name: "Launch Control",
    description:
      "Optimized launch system for maximum acceleration from a standstill with traction management.",
  },
  {
    category: "Performance",
    name: "Electronic Limited-Slip Differential (e-LSD)",
    description:
      "Electronically controlled limited-slip differential for superior cornering grip and stability.",
  },
];

function getFeaturesForVehicle(v: VehicleSeed): FeatureTemplate[] {
  const features: FeatureTemplate[] = [];

  // Every vehicle gets 1-2 safety features
  features.push(safetyFeatures[0]!);
  features.push(safetyFeatures[1]!);

  // Technology feature
  features.push(technologyFeatures[0]!);

  // Comfort feature
  features.push(comfortFeatures[0]!);

  // Type-specific features
  if (v.bodyType === "electric") {
    features.push(electricSpecificFeatures[0]!);
    features.push(electricSpecificFeatures[1]!);
    features.push(electricSpecificFeatures[2]!);
  } else if (v.slug.includes("-n-")) {
    features.push(nPerformanceFeatures[0]!);
    features.push(nPerformanceFeatures[1]!);
    features.push(nPerformanceFeatures[2]!);
  } else if (v.bodyType === "hybrid") {
    features.push(performanceFeatures[0]!);
    features.push(
      {
        category: "Technology",
        name: "Hybrid System Indicator",
        description:
          "Real-time display showing energy flow between engine, motor, and battery for optimal driving efficiency.",
      },
    );
  } else if (v.bodyType === "suv") {
    features.push(comfortFeatures[2]!); // Panoramic Sunroof
    features.push(performanceFeatures[0]!); // Drive Mode Select
  } else if (v.bodyType === "truck") {
    features.push(performanceFeatures[2]!); // HTRAC AWD
    features.push(
      {
        category: "Comfort",
        name: "Lockable Bed with Tonneau Cover",
        description:
          "Retractable tonneau cover with under-bed lockable storage compartments for secure cargo management.",
      },
    );
  } else {
    // Sedans
    features.push(performanceFeatures[0]!); // Drive Mode Select
  }

  return features;
}

// ---------------------------------------------------------------------------
// Image builder
// ---------------------------------------------------------------------------
interface ImageSeed {
  id: string;
  vehicleId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

function buildImagesForVehicle(v: VehicleSeed): ImageSeed[] {
  const modelLabel = encodeURIComponent(
    v.name.replace("Hyundai ", "").replace(/ /g, "+"),
  );
  return [
    {
      id: genId(),
      vehicleId: v.id,
      url: `https://placehold.co/800x500/002C5F/00AAD2?text=${modelLabel}+Front`,
      alt: `${v.name} front exterior view`,
      isPrimary: true,
      sortOrder: 0,
    },
    {
      id: genId(),
      vehicleId: v.id,
      url: `https://placehold.co/800x500/002C5F/00AAD2?text=${modelLabel}+Side`,
      alt: `${v.name} side profile view`,
      isPrimary: false,
      sortOrder: 1,
    },
    {
      id: genId(),
      vehicleId: v.id,
      url: `https://placehold.co/800x500/002C5F/00AAD2?text=${modelLabel}+Interior`,
      alt: `${v.name} interior dashboard view`,
      isPrimary: false,
      sortOrder: 2,
    },
  ];
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function seed() {
  console.log("=== Hyundai E-Commerce Database Seed ===\n");

  const db = createSeedDb();

  // ------------------------------------------------------------------
  // 1. Clear existing data (in dependency order)
  // ------------------------------------------------------------------
  console.log("[1/5] Clearing existing seed data...");
  try {
    await db.delete(vehicleFeatures);
    await db.delete(vehicleImages);
    await db.delete(vehicles);
    await db.delete(categories);
    console.log("  -> Existing data cleared.\n");
  } catch (err) {
    console.warn(
      "  -> Warning: Could not clear all tables (they may not exist yet). Continuing...\n",
      err instanceof Error ? err.message : err,
    );
  }

  // ------------------------------------------------------------------
  // 2. Insert categories
  // ------------------------------------------------------------------
  console.log("[2/5] Inserting categories...");
  const categoryData = buildCategories();
  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  console.log(`  -> Inserted ${insertedCategories.length} categories.\n`);

  // Build slug->id map for linking vehicles to categories
  const categoryMap = new Map<string, string>();
  for (const cat of insertedCategories) {
    categoryMap.set(cat.slug, cat.id);
  }

  // ------------------------------------------------------------------
  // 3. Insert vehicles
  // ------------------------------------------------------------------
  console.log("[3/5] Inserting vehicles...");
  const vehicleData = buildVehicles();
  const vehicleInsertValues = vehicleData.map((v) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    description: v.description,
    shortDescription: v.shortDescription,
    categoryId: categoryMap.get(v.categorySlug)!,
    bodyType: v.bodyType,
    year: v.year,
    price: v.price,
    msrp: v.msrp,
    mileage: v.mileage,
    fuelType: v.fuelType,
    transmission: v.transmission,
    engineSize: v.engineSize,
    horsepower: v.horsepower,
    seatingCapacity: v.seatingCapacity,
    drivetrain: v.drivetrain,
    exteriorColor: v.exteriorColor,
    interiorColor: v.interiorColor,
    status: v.status as "available",
    isFeatured: v.isFeatured,
    isNew: v.isNew,
    specs: v.specs,
  }));

  const insertedVehicles = await db
    .insert(vehicles)
    .values(vehicleInsertValues)
    .returning();
  console.log(`  -> Inserted ${insertedVehicles.length} vehicles.`);

  for (const v of insertedVehicles) {
    console.log(`     - ${v.name} ($${v.price})`);
  }
  console.log();

  // ------------------------------------------------------------------
  // 4. Insert vehicle images
  // ------------------------------------------------------------------
  console.log("[4/5] Inserting vehicle images...");
  const allImages: ImageSeed[] = [];
  for (const v of vehicleData) {
    allImages.push(...buildImagesForVehicle(v));
  }

  const insertedImages = await db
    .insert(vehicleImages)
    .values(allImages)
    .returning();
  console.log(
    `  -> Inserted ${insertedImages.length} images (${Math.round(insertedImages.length / insertedVehicles.length)} per vehicle).\n`,
  );

  // ------------------------------------------------------------------
  // 5. Insert vehicle features
  // ------------------------------------------------------------------
  console.log("[5/5] Inserting vehicle features...");
  const allFeatures: {
    id: string;
    vehicleId: string;
    category: string;
    name: string;
    description: string;
  }[] = [];

  for (const v of vehicleData) {
    const feats = getFeaturesForVehicle(v);
    for (const f of feats) {
      allFeatures.push({
        id: genId(),
        vehicleId: v.id,
        category: f.category,
        name: f.name,
        description: f.description,
      });
    }
  }

  const insertedFeatures = await db
    .insert(vehicleFeatures)
    .values(allFeatures)
    .returning();
  console.log(`  -> Inserted ${insertedFeatures.length} features.\n`);

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log("=== Seed Complete ===");
  console.log(`  Categories: ${insertedCategories.length}`);
  console.log(`  Vehicles:   ${insertedVehicles.length}`);
  console.log(`  Images:     ${insertedImages.length}`);
  console.log(`  Features:   ${insertedFeatures.length}`);
  console.log("\nDatabase is ready for development.\n");
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
seed()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n[SEED ERROR] Failed to seed database:\n", err);
    process.exit(1);
  });
