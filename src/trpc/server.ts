import "server-only";
import { createTRPCContext } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { cache } from "react";

const createContext = cache(async () => {
  return createTRPCContext();
});

export const api = cache(async () => {
  const context = await createContext();
  return createCaller(context);
});
