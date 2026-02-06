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
    product.images?.[0] ||
    "/placeholder.png";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="
        block bg-white rounded-lg
        overflow-hidden
        shadow-sm hover:shadow-md
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-4/4 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {discountPercent && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] px-2 py-1 rounded">
            {discountPercent}% OFF
          </span>
        )}

        {product.isNewArrival && (
          <span className="absolute top-2 right-2 bg-black text-white text-[11px] px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-3">
        {product.brand && (
          <p className="text-[11px] text-gray-500 uppercase mb-1">
            {product.brand}
          </p>
        )}

        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-black">
            ₹{product.price}
          </span>

          {hasDiscount && (
            <span className="text-xs text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}