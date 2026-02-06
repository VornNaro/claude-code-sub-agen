import { createTRPCRouter, publicProcedure } from "../trpc";
import { categories } from "@/server/db/schema";
import { asc } from "drizzle-orm";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: [asc(categories.sortOrder)],
    });
  }),
});
