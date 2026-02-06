import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../trpc";
import { reviews } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const reviewRouter = createTRPCRouter({
  getByVehicle: publicProcedure
    .input(
      z.object({
        vehicleId: z.string().uuid(),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findMany({
        where: eq(reviews.vehicleId, input.vehicleId),
        orderBy: [desc(reviews.createdAt)],
        limit: input.limit,
        with: { user: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        vehicleId: z.string().uuid(),
        rating: z.number().min(1).max(5),
        title: z.string().min(1).max(200),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [review] = await ctx.db
        .insert(reviews)
        .values({
          vehicleId: input.vehicleId,
          userId: ctx.userId,
          rating: input.rating,
          title: input.title,
          content: input.content,
        })
        .returning();

      return review;
    }),
});
