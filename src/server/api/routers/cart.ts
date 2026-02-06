import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cartItems } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const cartRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.cartItems.findMany({
      where: eq(cartItems.userId, ctx.userId),
      with: {
        vehicle: {
          with: {
            images: { limit: 1 },
          },
        },
      },
    });
  }),

  add: protectedProcedure
    .input(z.object({ vehicleId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.userId, ctx.userId),
          eq(cartItems.vehicleId, input.vehicleId),
        ),
      });

      if (existing) {
        return existing;
      }

      const [item] = await ctx.db
        .insert(cartItems)
        .values({
          userId: ctx.userId,
          vehicleId: input.vehicleId,
        })
        .returning();

      return item;
    }),

  remove: protectedProcedure
    .input(z.object({ itemId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.id, input.itemId),
            eq(cartItems.userId, ctx.userId),
          ),
        );
    }),
});
