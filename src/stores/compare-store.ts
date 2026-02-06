"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  vehicleIds: string[];
  addVehicle: (id: string) => void;
  removeVehicle: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      vehicleIds: [],

      addVehicle: (id) => {
        if (get().vehicleIds.length >= MAX_COMPARE) return;
        if (get().vehicleIds.includes(id)) return;
        set((state) => ({ vehicleIds: [...state.vehicleIds, id] }));
      },

      removeVehicle: (id) => {
        set((state) => ({
          vehicleIds: state.vehicleIds.filter((v) => v !== id),
        }));
      },

      clearAll: () => set({ vehicleIds: [] }),

      isInCompare: (id) => get().vehicleIds.includes(id),
    }),
    {
      name: "hyundai-compare",
    },
  ),
);
