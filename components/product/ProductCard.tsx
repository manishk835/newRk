"use client";

import Link from "next/link";
import { Product } from "./product.types";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group border rounded-lg p-4 hover:shadow-md transition block"
    >
      {/* IMAGE */}
      <div className="relative w-full h-44 bg-gray-100 rounded mb-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        {!product.inStock && (
          <span className="absolute top-2 left-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>

      {/* TITLE */}
      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
        {product.title}
      </h3>

      {/* PRICE */}
      <div className="mt-1 flex items-center gap-2">
        <span className="font-semibold text-gray-900">
          ₹{product.price}
        </span>

        {hasDiscount && (
          <span className="text-sm text-gray-500 line-through">
            ₹{product.originalPrice}
          </span>
        )}
      </div>
    </Link>
  );
}
