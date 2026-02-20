"use client";

import { useWishlist } from "@/app/hooks/useWishlist";
import { useState } from "react";

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const [processing, setProcessing] = useState(false);

  const isWishlisted = wishlist.includes(productId);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation(); // prevent card click

    if (processing) return;

    try {
      setProcessing(true);
      await toggleWishlist(productId);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={handleClick}
      disabled={processing}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={`
        p-2 rounded-full
        bg-white/90 backdrop-blur
        shadow-md
        transition-all duration-200
        hover:scale-110
        ${isWishlisted ? "text-red-600" : "text-gray-400 hover:text-red-500"}
        ${processing ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isWishlisted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
    </button>
  );
}


// "use client";

// import { useWishlist } from "@/app/hooks/useWishlist";

// export default function WishlistButton({
//   productId,
// }: {
//   productId: string;
// }) {
//   const { wishlist, toggleWishlist, loading } =
//     useWishlist();

//   const isWishlisted = wishlist.includes(productId);

//   if (loading) return null;

//   return (
//     <button
//       onClick={() => toggleWishlist(productId)}
//       className={`p-2 rounded-full shadow transition ${
//         isWishlisted
//           ? "bg-red-100 text-red-600"
//           : "bg-white text-gray-400 hover:text-red-500"
//       }`}
//     >
//       {isWishlisted ? "❤️" : "🤍"}
//     </button>
//   );
// }
