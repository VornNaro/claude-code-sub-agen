import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type VehicleListItem =
  RouterOutput["vehicle"]["getInfiniteList"]["items"][number];

export type VehicleDetail = NonNullable<
  RouterOutput["vehicle"]["getBySlug"]
>;

export type Category = RouterOutput["category"]["getAll"][number];

export type CartItem = RouterOutput["cart"]["get"][number];

export type Order = RouterOutput["order"]["getAll"][number];

export type Review = RouterOutput["review"]["getByVehicle"][number];

export type VehicleCompareItem =
  RouterOutput["vehicle"]["getByIds"][number];
