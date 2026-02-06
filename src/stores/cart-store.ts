"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalCartItem {
  vehicleId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  addedAt: number;
}

interface CartState {
  items: LocalCartItem[];
  addItem: (item: Omit<LocalCartItem, "addedAt">) => void;
  removeItem: (vehicleId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.some(
          (i) => i.vehicleId === item.vehicleId,
        );
        if (exists) return;
        set((state) => ({
          items: [...state.items, { ...item, addedAt: Date.now() }],
        }));
      },

      removeItem: (vehicleId) => {
        set((state) => ({
          items: state.items.filter((i) => i.vehicleId !== vehicleId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.length,

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: "hyundai-cart",
    },
  ),
);
