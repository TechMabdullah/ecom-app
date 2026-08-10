import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) => {
        const current = get().productIds;
        set({
          productIds: current.includes(id)
            ? current.filter((p) => p !== id)
            : [...current, id],
        });
      },
      has: (id) => get().productIds.includes(id),
    }),
    { name: "wishlist-storage" }
  )
);