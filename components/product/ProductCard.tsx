"use client";

import Link from "next/link";
import { Product } from "./product.types";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const hasDiscount =
    product.originalPrice &&
    product.originalPrice > product.price;

  const discountPercent =
    hasDiscount && product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : null;

  const imageUrl =
    product.thumbnail ||
    (product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png");

  return (
    <Link
      href={`/product/${product.slug}`}
      className="
        group block
        rounded-2xl border
        bg-white
        overflow-hidden
        transition
        hover:shadow-xl
      "
    >
      {/* IMAGE */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="
            w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-110
          "
        />

        {/* BADGES */}
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
            New
          </span>
        )}

        {!product.inStock && (
          <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {discountPercent && (
          <span className="absolute top-3 right-3 bg-[#D32F2F] text-white text-xs px-3 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4 space-y-2">
        {/* BRAND */}
        {product.brand && (
          <p className="text-xs uppercase text-gray-500 tracking-wide">
            {product.brand}
          </p>
        )}

        {/* TITLE */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.title}
        </h3>

        {/* RATING */}
        {product.rating && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span className="font-semibold">
              ⭐ {product.rating.average}
            </span>
            <span>({product.rating.count})</span>
          </div>
        )}

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
