// 📄 app/(public)/product/[slug]/ProductDetailClient.tsx

"use client";

import { useState } from "react";
import { useCart } from "@/features/cart/CartContext";
import type { Product } from "@/components/ui/product/product.types";

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {

  const { dispatch } = useCart();

  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.url ||
    product.thumbnail ||
    "/placeholder.png"
  );

  const [qty, setQty] = useState(1);

  const isInStock = (product.totalStock ?? 0) > 0;

  const discount =
    product.originalPrice &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  return (
    <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

      {/* ================= IMAGE GALLERY ================= */}
      <div className="flex gap-4">

        <div className="flex flex-col gap-3">
          {(product.images ?? []).map((img, i) => (
            <img
              key={i}
              src={img.url}
              onClick={() => setActiveImage(img.url)}
              className={`w-16 h-20 object-cover rounded-md border cursor-pointer ${
                activeImage === img.url
                  ? "border-black"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 border w-full relative shadow-sm">

          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}

          <img
            src={activeImage}
            className="w-full aspect-3/4 object-contain"
          />
        </div>
      </div>

      {/* ================= BUY BOX ================= */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-28 h-fit">

        <p className="text-sm text-gray-500 mb-1">
          {product.brand}
        </p>

        <h1 className="text-2xl font-semibold mb-3">
          {product.title}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold">
            ₹{product.price}
          </span>

          {discount > 0 && (
            <>
              <span className="line-through text-gray-400">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 text-sm">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        <p
          className={`text-sm mb-5 ${
            isInStock
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </p>

        {/* Quantity */}
        <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-5">
          <span>Quantity</span>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setQty((q) => Math.max(1, q - 1))
              }
              className="w-8 h-8 rounded-full border"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full border"
            >
              +
            </button>
          </div>
        </div>

        <button
          disabled={!isInStock}
          onClick={() =>
            dispatch({
              type: "ADD_TO_CART",
              payload: { product, quantity: qty },
            })
          }
          className={`w-full py-3 rounded-xl font-semibold ${
            isInStock
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Add to Cart
        </button>

        <div className="mt-6 text-sm text-gray-500 space-y-2">
          <p>✔ 7 Days Return</p>
          <p>✔ Secure Payment</p>
          <p>✔ Fast Delivery</p>
        </div>
      </div>
    </div>
  );
}