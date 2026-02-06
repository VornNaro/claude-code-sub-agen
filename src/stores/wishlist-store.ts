"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  vehicleIds: string[];
  addVehicle: (id: string) => void;
  removeVehicle: (id: string) => void;
  toggleVehicle: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      vehicleIds: [],

      addVehicle: (id) => {
        if (get().vehicleIds.includes(id)) return;
        set((state) => ({ vehicleIds: [...state.vehicleIds, id] }));
      },

      removeVehicle: (id) => {
        set((state) => ({
          vehicleIds: state.vehicleIds.filter((v) => v !== id),
        }));
      },

      toggleVehicle: (id) => {
        if (get().vehicleIds.includes(id)) {
          get().removeVehicle(id);
        } else {
          get().addVehicle(id);
        }
      },

      isInWishlist: (id) => get().vehicleIds.includes(id),

      clearAll: () => set({ vehicleIds: [] }),
    }),
    {
      name: "hyundai-wishlist",
    },
  ),
);
