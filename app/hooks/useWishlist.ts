"use client";

import { useEffect, useState } from "react";

type WishlistProduct = {
  _id: string;
};

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD WISHLIST ================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          { credentials: "include" }
        );

        if (!res.ok) {
          setWishlist([]);
          return;
        }

        const data: WishlistProduct[] = await res.json();
        setWishlist(data.map((item) => item._id));
      } catch {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  /* ================= TOGGLE ================= */
  const toggleWishlist = async (productId: string) => {
    const exists = wishlist.includes(productId);

    try {
      if (exists) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        setWishlist((prev) =>
          prev.filter((id) => id !== productId)
        );
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productId }),
          }
        );

        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  return {
    wishlist,
    toggleWishlist,
    loading,
  };
}
