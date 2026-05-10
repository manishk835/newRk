// // // 📄 app/(public)/product/[slug]/ProductDetailClient.tsx

"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/features/cart/CartContext";
import type { Product } from "@/components/ui/product/product.types";

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const { dispatch } = useCart();

  /* =====================================================
     VARIANT LOGIC (PROPER FILTERING)
  ====================================================== */

  const allVariants = product.variants ?? [];

  const availableSizes = [
    ...new Set(allVariants.map(v => v.size)),
  ];

  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0]
  );

  const filteredColors = [
    ...new Set(
      allVariants
        .filter(v => v.size === selectedSize)
        .map(v => v.color)
    ),
  ];

  const [selectedColor, setSelectedColor] = useState(
    filteredColors[0]
  );

  // Reset color if size changes
  useEffect(() => {
    setSelectedColor(filteredColors[0]);
  }, [selectedSize]);

  const selectedVariant = useMemo(() => {
    return allVariants.find(
      v =>
        v.size === selectedSize &&
        v.color === selectedColor
    );
  }, [selectedSize, selectedColor, allVariants]);

  const variantStock = selectedVariant?.stock ?? 0;
  const isInStock = variantStock > 0;

  /* =====================================================
     IMAGE GALLERY
  ====================================================== */

  const images =
    product.images?.map(i => i.url) ??
    [];

  const [activeImage, setActiveImage] =
    useState(
      images[0] ||
        product.thumbnail ||
        "/placeholder.png"
    );

  /* =====================================================
     PRICING
  ====================================================== */

  const finalPrice =
    selectedVariant?.priceOverride ??
    product.price;

  const discount =
    product.originalPrice &&
    product.originalPrice > finalPrice
      ? Math.round(
          ((product.originalPrice - finalPrice) /
            product.originalPrice) *
            100
        )
      : 0;

  /* =====================================================
     QUANTITY
  ====================================================== */

  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [selectedVariant]);

  const increaseQty = () => {
    if (qty < variantStock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    setQty(q => Math.max(1, q - 1));
  };

  /* =====================================================
     ADD TO CART
  ====================================================== */

  const handleAddToCart = () => {
    if (!selectedVariant || !isInStock) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        variant: selectedVariant,
        quantity: qty,
      },
    });

    alert("Added to cart ✅");
  };

  /* =====================================================
     UI
  ====================================================== */

  return (
    <div className="container mx-auto px-4 py-12">

      <div className="grid lg:grid-cols-2 gap-14">

        {/* ================= IMAGE SECTION ================= */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3">

            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-20 object-cover rounded-xl border cursor-pointer transition ${
                  activeImage === img
                    ? "border-black dark:border-white"
                    : "border-gray-200 dark:border-zinc-700"
                }`}
              />
            ))}

          </div>

          {/* Main Image */}
          <div className="relative flex-1 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-8 shadow-sm transition-colors duration-300">

            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-black dark:bg-white text-white dark:text-black text-xs px-3 py-1 rounded-full">
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
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm sticky top-28 h-fit transition-colors duration-300">

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {product.brand}
          </p>

          <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">
            {product.title}
          </h1>

          {/* PRICE */}
          <div className="mb-6">

            <div className="flex items-center gap-4">

              <span className="text-3xl font-bold text-black dark:text-white">
                ₹{finalPrice}
              </span>

              {discount > 0 && (
                <span className="line-through text-gray-400 dark:text-gray-500">
                  ₹{product.originalPrice}
                </span>
              )}

            </div>

            {discount > 0 && (
              <p className="text-green-600 text-sm mt-1">
                You save {discount}%
              </p>
            )}

          </div>

          {/* STOCK */}
          <p
            className={`text-sm mb-6 font-medium ${
              isInStock
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {isInStock
              ? `In Stock (${variantStock} left)`
              : "Out of Stock"}
          </p>

          {/* SIZE */}
          <div className="mb-5">

            <p className="font-medium text-black dark:text-white mb-2">
              Select Size
            </p>

            <div className="flex gap-3 flex-wrap">

              {availableSizes.map(size => {
                const hasStock =
                  allVariants.find(
                    v =>
                      v.size === size &&
                      v.stock > 0
                  );

                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`px-4 py-2 border rounded-xl text-sm transition ${
                      selectedSize === size
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "border-gray-300 dark:border-zinc-700 text-black dark:text-white"
                    } ${
                      !hasStock
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {size}
                  </button>
                );
              })}

            </div>
          </div>

          {/* COLOR */}
          <div className="mb-6">

            <p className="font-medium text-black dark:text-white mb-2">
              Select Color
            </p>

            <div className="flex gap-3 flex-wrap">

              {filteredColors.map(color => {
                const colorVariant =
                  allVariants.find(
                    v =>
                      v.size === selectedSize &&
                      v.color === color
                  );

                return (
                  <button
                    key={color}
                    disabled={!colorVariant?.stock}
                    onClick={() =>
                      setSelectedColor(color)
                    }
                    className={`px-4 py-2 border rounded-xl text-sm capitalize transition ${
                      selectedColor === color
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "border-gray-300 dark:border-zinc-700 text-black dark:text-white"
                    } ${
                      !colorVariant?.stock
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {color}
                  </button>
                );
              })}

            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center justify-between border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 mb-6 transition-colors duration-300">

            <span className="font-medium text-black dark:text-white">
              Quantity
            </span>

            <div className="flex items-center gap-4">

              <button
                onClick={decreaseQty}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                -
              </button>

              <span className="text-black dark:text-white">
                {qty}
              </span>

              <button
                onClick={increaseQty}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                +
              </button>

            </div>
          </div>

          {/* ADD TO CART */}
          <button
            disabled={!isInStock}
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isInStock
                ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                : "bg-gray-300 dark:bg-zinc-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            Add to Cart
          </button>

          {/* TRUST BADGES */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>✔ 7 Days Easy Return</p>
            <p>✔ Secure Payments</p>
            <p>✔ Trusted Seller</p>
          </div>

        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mt-16">

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">

          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            Product Description
          </h2>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

        </div>
      </div>
    </div>
  );
}