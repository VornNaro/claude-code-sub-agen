import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { vehicles, vehicleImages } from "@/server/db/schema";
import { eq, desc, asc, and, gte, lte, sql } from "drizzle-orm";

const sortOptions = z.enum([
  "newest",
  "price_asc",
  "price_desc",
  "year_desc",
  "mileage_asc",
]);

export const vehicleRouter = createTRPCRouter({
  getInfiniteList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(12),
        cursor: z.string().nullish(),
        categorySlug: z.string().optional(),
        bodyType: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        minYear: z.number().optional(),
        maxYear: z.number().optional(),
        fuelType: z.string().optional(),
        isNew: z.boolean().optional(),
        sort: sortOptions.default("newest"),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, sort, ...filters } = input;

      const conditions = [eq(vehicles.status, "available")];

      if (filters.bodyType) {
        conditions.push(
          eq(vehicles.bodyType, filters.bodyType as typeof vehicles.bodyType.enumValues[number]),
        );
      }
      if (filters.minPrice) {
        conditions.push(gte(vehicles.price, String(filters.minPrice)));
      }
      if (filters.maxPrice) {
        conditions.push(lte(vehicles.price, String(filters.maxPrice)));
      }
      if (filters.minYear) {
        conditions.push(gte(vehicles.year, filters.minYear));
      }
      if (filters.maxYear) {
        conditions.push(lte(vehicles.year, filters.maxYear));
      }
      if (filters.fuelType) {
        conditions.push(eq(vehicles.fuelType, filters.fuelType));
      }
      if (filters.isNew !== undefined) {
        conditions.push(eq(vehicles.isNew, filters.isNew));
      }
      if (filters.search) {
        conditions.push(
          sql`(${vehicles.name} ILIKE ${`%${filters.search}%`} OR ${vehicles.description} ILIKE ${`%${filters.search}%`})`,
        );
      }

      const orderBy = {
        newest: [desc(vehicles.createdAt)],
        price_asc: [asc(vehicles.price)],
        price_desc: [desc(vehicles.price)],
        year_desc: [desc(vehicles.year)],
        mileage_asc: [asc(vehicles.mileage)],
      }[sort];

      const decodedCursor = cursor
        ? JSON.parse(Buffer.from(cursor, "base64").toString())
        : null;

      const items = await ctx.db.query.vehicles.findMany({
        where: and(...conditions),
        orderBy,
        limit: limit + 1,
        offset: decodedCursor?.offset ?? 0,
        with: {
          images: {
            where: eq(vehicleImages.isPrimary, true),
            limit: 1,
          },
          category: true,
        },
      });

      let nextCursor: string | undefined;
      if (items.length > limit) {
        items.pop();
        const nextOffset = (decodedCursor?.offset ?? 0) + limit;
        nextCursor = Buffer.from(
          JSON.stringify({ offset: nextOffset }),
        ).toString("base64");
      }

      return {
        items,
        nextCursor,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const vehicle = await ctx.db.query.vehicles.findFirst({
        where: eq(vehicles.slug, input.slug),
        with: {
          images: { orderBy: [asc(vehicleImages.sortOrder)] },
          features: true,
          category: true,
          reviews: { limit: 10 },
        },
      });

      return vehicle ?? null;
    }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.vehicles.findMany({
      where: and(
        eq(vehicles.isFeatured, true),
        eq(vehicles.status, "available"),
      ),
      limit: 8,
      with: {
        images: {
          where: eq(vehicleImages.isPrimary, true),
          limit: 1,
        },
        category: true,
      },
    });
  }),
});
