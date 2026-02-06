import { createCallerFactory, createTRPCRouter } from "./trpc";
import { vehicleRouter } from "./routers/vehicle";
import { categoryRouter } from "./routers/category";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { reviewRouter } from "./routers/review";

export const appRouter = createTRPCRouter({
  vehicle: vehicleRouter,
  category: categoryRouter,
  cart: cartRouter,
  order: orderRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
