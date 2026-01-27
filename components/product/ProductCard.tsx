"use client";

import Link from "next/link";
import { Product } from "./product.types";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  const discountPercent =
    hasDiscount && product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="
        group block
        rounded-xl border
        bg-white
        hover:shadow-lg
        transition
        overflow-hidden
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* OUT OF STOCK */}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {/* DISCOUNT */}
        {discountPercent && (
          <span className="absolute top-3 right-3 bg-[#D32F2F] text-white text-xs px-3 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4">
        {/* TITLE */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {product.title}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#111111]">
            ₹{product.price}
          </span>

          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
