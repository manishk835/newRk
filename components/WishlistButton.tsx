"use client";

import { useWishlist } from "@/app/hooks/useWishlist";

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const { wishlist, toggleWishlist, loading } =
    useWishlist();

  const isWishlisted = wishlist.includes(productId);

  if (loading) return null;

  return (
    <button
      onClick={() => toggleWishlist(productId)}
      className={`p-2 rounded-full shadow transition ${
        isWishlisted
          ? "bg-red-100 text-red-600"
          : "bg-white text-gray-400 hover:text-red-500"
      }`}
    >
      {isWishlisted ? "❤️" : "🤍"}
    </button>
  );
}
