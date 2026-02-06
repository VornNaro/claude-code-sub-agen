import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { orders, orderItems } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.orders.findMany({
      where: eq(orders.userId, ctx.userId),
      orderBy: [desc(orders.createdAt)],
      with: {
        items: {
          with: { vehicle: true },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.orderId),
        with: {
          items: {
            with: { vehicle: true },
          },
        },
      });
    }),
});
