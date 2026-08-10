"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const totalItems = useCart((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);

  // Avoids a hydration mismatch: server renders 0 items (no localStorage access),
  // client might have items already in localStorage — so we wait until mounted
  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
}, []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur border-b"
      style={{ borderColor: "var(--trace)", backgroundColor: "rgba(245, 240, 230, 0.85)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold">
          circuit<span style={{ color: "var(--amber)" }}>.parts</span>
        </Link>

        <nav className="flex items-center gap-6 font-mono text-sm">
          <Link href="/products" className="opacity-70 hover:opacity-100">
            shop
          </Link>
          
          <Link href="/orders" className="opacity-70 hover:opacity-100">
            orders
          </Link>
          {mounted && auth.currentUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <Link href="/admin" className="opacity-70 hover:opacity-100">
          admin
          </Link>
          )}

          <Link href="/wishlist" className="opacity-70 hover:opacity-100">
             wishlist
          </Link>
          
          <Link href="/cart" className="relative opacity-70 hover:opacity-100">
            cart
            {mounted && totalItems > 0 && (
              <span
                className="absolute -top-2 -right-3 text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
                style={{ backgroundColor: "var(--amber)", color: "var(--graphite)" }}
              >
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/login" className="opacity-70 hover:opacity-100">
            login
          </Link>
        </nav>
      </div>
    </header>
  );
}