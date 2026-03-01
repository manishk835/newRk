"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/features/cart/CartContext";
import type { Product } from "@/components/ui/product/product.types";

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const { dispatch } = useCart();

  /* ================= VARIANT STATE ================= */

  const availableSizes = [
    ...new Set(product.variants?.map(v => v.size)),
  ];

  const availableColors = [
    ...new Set(product.variants?.map(v => v.color)),
  ];

  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0]
  );
  const [selectedColor, setSelectedColor] = useState(
    availableColors[0]
  );

  const selectedVariant = useMemo(() => {
    return product.variants?.find(
      v =>
        v.size === selectedSize &&
        v.color === selectedColor
    );
  }, [product, selectedSize, selectedColor]);

  const variantStock = selectedVariant?.stock ?? 0;

  /* ================= IMAGE ================= */

  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.url ||
      product.thumbnail ||
      "/placeholder.png"
  );

  /* ================= PRICE ================= */

  const finalPrice =
    selectedVariant?.priceOverride ||
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

  /* ================= QTY ================= */

  const [qty, setQty] = useState(1);

  const isInStock = variantStock > 0;

  const increaseQty = () => {
    if (qty < variantStock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    setQty(q => Math.max(1, q - 1));
  };

  /* ================= ADD TO CART ================= */

  const handleAddToCart = () => {
    if (!isInStock) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        variant: selectedVariant,
        quantity: qty,
      },
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-14">

      {/* ================= IMAGE GALLERY ================= */}
      <div className="flex gap-4">

        <div className="flex flex-col gap-3">
          {(product.images ?? []).map((img, i) => (
            <img
              key={i}
              src={img.url}
              onClick={() => setActiveImage(img.url)}
              className={`w-16 h-20 object-cover rounded-lg border cursor-pointer ${
                activeImage === img.url
                  ? "border-black"
                  : "border-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="relative flex-1 bg-white rounded-2xl p-6 border shadow-sm">

          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
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
      <div className="bg-white p-8 rounded-2xl border shadow-sm sticky top-28 h-fit">

        <p className="text-sm text-gray-500 mb-1">
          {product.brand}
        </p>

        <h1 className="text-2xl font-semibold mb-4">
          {product.title}
        </h1>

        {/* PRICE */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold">
            ₹{finalPrice}
          </span>

          {discount > 0 && (
            <>
              <span className="line-through text-gray-400">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 text-sm">
                Save {discount}%
              </span>
            </>
          )}
        </div>

        {/* STOCK */}
        <p
          className={`text-sm mb-6 ${
            isInStock
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isInStock
            ? `In Stock (${variantStock} available)`
            : "Out of Stock"}
        </p>

        {/* SIZE SELECTOR */}
        <div className="mb-5">
          <p className="font-medium mb-2">
            Size
          </p>
          <div className="flex gap-3 flex-wrap">
            {availableSizes.map(size => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSize(size)
                }
                className={`px-4 py-2 border rounded-lg text-sm ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* COLOR SELECTOR */}
        <div className="mb-6">
          <p className="font-medium mb-2">
            Color
          </p>
          <div className="flex gap-3 flex-wrap">
            {availableColors.map(color => (
              <button
                key={color}
                onClick={() =>
                  setSelectedColor(color)
                }
                className={`px-4 py-2 border rounded-lg text-sm capitalize ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* QUANTITY */}
        <div className="flex items-center justify-between border rounded-xl px-4 py-3 mb-6">
          <span>Quantity</span>

          <div className="flex items-center gap-4">
            <button
              onClick={decreaseQty}
              className="w-8 h-8 rounded-full border"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={increaseQty}
              className="w-8 h-8 rounded-full border"
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
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Add to Cart
        </button>

        {/* TRUST */}
        <div className="mt-8 text-sm text-gray-500 space-y-2">
          <p>✔ 7 Days Return</p>
          <p>✔ Secure Payment</p>
          <p>✔ Verified Seller</p>
        </div>
      </div>

      {/* ================= DESCRIPTION SECTION ================= */}
      <div className="lg:col-span-2 mt-16">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Product Description
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

    </div>
  );
}

// // 📄 app/(public)/product/[slug]/ProductDetailClient.tsx

// "use client";

// import { useState } from "react";
// import { useCart } from "@/features/cart/CartContext";
// import type { Product } from "@/components/ui/product/product.types";

// export default function ProductDetailClient({
//   product,
// }: {
//   product: Product;
// }) {

//   const { dispatch } = useCart();

//   const [activeImage, setActiveImage] = useState(
//     product.images?.[0]?.url ||
//     product.thumbnail ||
//     "/placeholder.png"
//   );

//   const [qty, setQty] = useState(1);

//   const isInStock = (product.totalStock ?? 0) > 0;

//   const discount =
//     product.originalPrice &&
//     product.originalPrice > product.price
//       ? Math.round(
//           ((product.originalPrice - product.price) /
//             product.originalPrice) *
//             100
//         )
//       : 0;

//   return (
//     <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

//       {/* ================= IMAGE GALLERY ================= */}
//       <div className="flex gap-4">

//         <div className="flex flex-col gap-3">
//           {(product.images ?? []).map((img, i) => (
//             <img
//               key={i}
//               src={img.url}
//               onClick={() => setActiveImage(img.url)}
//               className={`w-16 h-20 object-cover rounded-md border cursor-pointer ${
//                 activeImage === img.url
//                   ? "border-black"
//                   : "border-gray-300"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="bg-white rounded-2xl p-4 border w-full relative shadow-sm">

//           {discount > 0 && (
//             <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
//               {discount}% OFF
//             </span>
//           )}

//           <img
//             src={activeImage}
//             className="w-full aspect-3/4 object-contain"
//           />
//         </div>
//       </div>

//       {/* ================= BUY BOX ================= */}
//       <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-28 h-fit">

//         <p className="text-sm text-gray-500 mb-1">
//           {product.brand}
//         </p>

//         <h1 className="text-2xl font-semibold mb-3">
//           {product.title}
//         </h1>

//         <div className="flex items-center gap-3 mb-4">
//           <span className="text-3xl font-bold">
//             ₹{product.price}
//           </span>

//           {discount > 0 && (
//             <>
//               <span className="line-through text-gray-400">
//                 ₹{product.originalPrice}
//               </span>
//               <span className="text-green-600 text-sm">
//                 {discount}% OFF
//               </span>
//             </>
//           )}
//         </div>

//         <p
//           className={`text-sm mb-5 ${
//             isInStock
//               ? "text-green-600"
//               : "text-red-600"
//           }`}
//         >
//           {isInStock ? "In Stock" : "Out of Stock"}
//         </p>

//         {/* Quantity */}
//         <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-5">
//           <span>Quantity</span>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() =>
//                 setQty((q) => Math.max(1, q - 1))
//               }
//               className="w-8 h-8 rounded-full border"
//             >
//               -
//             </button>

//             <span>{qty}</span>

//             <button
//               onClick={() => setQty((q) => q + 1)}
//               className="w-8 h-8 rounded-full border"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         <button
//           disabled={!isInStock}
//           onClick={() =>
//             dispatch({
//               type: "ADD_TO_CART",
//               payload: { product, quantity: qty },
//             })
//           }
//           className={`w-full py-3 rounded-xl font-semibold ${
//             isInStock
//               ? "bg-black text-white"
//               : "bg-gray-300 text-gray-500"
//           }`}
//         >
//           Add to Cart
//         </button>

//         <div className="mt-6 text-sm text-gray-500 space-y-2">
//           <p>✔ 7 Days Return</p>
//           <p>✔ Secure Payment</p>
//           <p>✔ Fast Delivery</p>
//         </div>
//       </div>
//     </div>
//   );
// }