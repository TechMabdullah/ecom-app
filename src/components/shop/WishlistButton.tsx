"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistButton({ productId }: { productId: string }) {
  const { toggle, has } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const saved = has(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(productId);
      }}
      className="w-8 h-8 flex items-center justify-center rounded-full border"
      style={{
        borderColor: saved ? "var(--amber)" : "var(--trace)",
        backgroundColor: saved ? "var(--amber)" : "var(--pcb)",
      }}
      aria-label="Toggle wishlist"
    >
      <span style={{ color: saved ? "var(--pcb)" : "var(--amber)" }}>{saved ? "♥" : "♡"}</span>
    </button>
  );
}