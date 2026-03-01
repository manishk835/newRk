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
                    ? "border-black"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="relative flex-1 bg-white rounded-3xl border p-8 shadow-sm">

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
        <div className="bg-white p-8 rounded-3xl border shadow-sm sticky top-28 h-fit">

          <p className="text-sm text-gray-500 mb-1">
            {product.brand}
          </p>

          <h1 className="text-2xl font-semibold mb-4">
            {product.title}
          </h1>

          {/* PRICE */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">
                ₹{finalPrice}
              </span>

              {discount > 0 && (
                <span className="line-through text-gray-400">
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
            <p className="font-medium mb-2">
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
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
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
            <p className="font-medium mb-2">
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
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
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
          <div className="flex items-center justify-between border rounded-xl px-4 py-3 mb-6">
            <span className="font-medium">
              Quantity
            </span>

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

          {/* TRUST BADGES */}
          <div className="mt-8 text-sm text-gray-500 space-y-2">
            <p>✔ 7 Days Easy Return</p>
            <p>✔ Secure Payments</p>
            <p>✔ Trusted Seller</p>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mt-16">
        <div className="bg-white border rounded-3xl p-8 shadow-sm">
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

// // // 📄 app/(public)/product/[slug]/ProductDetailClient.tsx

// "use client";

// import { useMemo, useState } from "react";
// import { useCart } from "@/features/cart/CartContext";
// import type { Product } from "@/components/ui/product/product.types";

// export default function ProductDetailClient({
//   product,
// }: {
//   product: Product;
// }) {
//   const { dispatch } = useCart();

//   /* ================= VARIANT STATE ================= */

//   const availableSizes = [
//     ...new Set(product.variants?.map(v => v.size)),
//   ];

//   const availableColors = [
//     ...new Set(product.variants?.map(v => v.color)),
//   ];

//   const [selectedSize, setSelectedSize] = useState(
//     availableSizes[0]
//   );
//   const [selectedColor, setSelectedColor] = useState(
//     availableColors[0]
//   );

//   const selectedVariant = useMemo(() => {
//     return product.variants?.find(
//       v =>
//         v.size === selectedSize &&
//         v.color === selectedColor
//     );
//   }, [product, selectedSize, selectedColor]);

//   const variantStock = selectedVariant?.stock ?? 0;

//   /* ================= IMAGE ================= */

//   const [activeImage, setActiveImage] = useState(
//     product.images?.[0]?.url ||
//       product.thumbnail ||
//       "/placeholder.png"
//   );

//   /* ================= PRICE ================= */

//   const finalPrice =
//     selectedVariant?.priceOverride ||
//     product.price;

//   const discount =
//     product.originalPrice &&
//     product.originalPrice > finalPrice
//       ? Math.round(
//           ((product.originalPrice - finalPrice) /
//             product.originalPrice) *
//             100
//         )
//       : 0;

//   /* ================= QTY ================= */

//   const [qty, setQty] = useState(1);

//   const isInStock = variantStock > 0;

//   const increaseQty = () => {
//     if (qty < variantStock) {
//       setQty(qty + 1);
//     }
//   };

//   const decreaseQty = () => {
//     setQty(q => Math.max(1, q - 1));
//   };

//   /* ================= ADD TO CART ================= */

//   const handleAddToCart = () => {
//     if (!isInStock) return;

//     dispatch({
//       type: "ADD_TO_CART",
//       payload: {
//         product,
//         variant: selectedVariant,
//         quantity: qty,
//       },
//     });
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-14">

//       {/* ================= IMAGE GALLERY ================= */}
//       <div className="flex gap-4">

//         <div className="flex flex-col gap-3">
//           {(product.images ?? []).map((img, i) => (
//             <img
//               key={i}
//               src={img.url}
//               onClick={() => setActiveImage(img.url)}
//               className={`w-16 h-20 object-cover rounded-lg border cursor-pointer ${
//                 activeImage === img.url
//                   ? "border-black"
//                   : "border-gray-200"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="relative flex-1 bg-white rounded-2xl p-6 border shadow-sm">

//           {discount > 0 && (
//             <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
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
//       <div className="bg-white p-8 rounded-2xl border shadow-sm sticky top-28 h-fit">

//         <p className="text-sm text-gray-500 mb-1">
//           {product.brand}
//         </p>

//         <h1 className="text-2xl font-semibold mb-4">
//           {product.title}
//         </h1>

//         {/* PRICE */}
//         <div className="flex items-center gap-3 mb-6">
//           <span className="text-3xl font-bold">
//             ₹{finalPrice}
//           </span>

//           {discount > 0 && (
//             <>
//               <span className="line-through text-gray-400">
//                 ₹{product.originalPrice}
//               </span>
//               <span className="text-green-600 text-sm">
//                 Save {discount}%
//               </span>
//             </>
//           )}
//         </div>

//         {/* STOCK */}
//         <p
//           className={`text-sm mb-6 ${
//             isInStock
//               ? "text-green-600"
//               : "text-red-600"
//           }`}
//         >
//           {isInStock
//             ? `In Stock (${variantStock} available)`
//             : "Out of Stock"}
//         </p>

//         {/* SIZE SELECTOR */}
//         <div className="mb-5">
//           <p className="font-medium mb-2">
//             Size
//           </p>
//           <div className="flex gap-3 flex-wrap">
//             {availableSizes.map(size => (
//               <button
//                 key={size}
//                 onClick={() =>
//                   setSelectedSize(size)
//                 }
//                 className={`px-4 py-2 border rounded-lg text-sm ${
//                   selectedSize === size
//                     ? "border-black bg-black text-white"
//                     : "border-gray-300"
//                 }`}
//               >
//                 {size}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* COLOR SELECTOR */}
//         <div className="mb-6">
//           <p className="font-medium mb-2">
//             Color
//           </p>
//           <div className="flex gap-3 flex-wrap">
//             {availableColors.map(color => (
//               <button
//                 key={color}
//                 onClick={() =>
//                   setSelectedColor(color)
//                 }
//                 className={`px-4 py-2 border rounded-lg text-sm capitalize ${
//                   selectedColor === color
//                     ? "border-black bg-black text-white"
//                     : "border-gray-300"
//                 }`}
//               >
//                 {color}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* QUANTITY */}
//         <div className="flex items-center justify-between border rounded-xl px-4 py-3 mb-6">
//           <span>Quantity</span>

//           <div className="flex items-center gap-4">
//             <button
//               onClick={decreaseQty}
//               className="w-8 h-8 rounded-full border"
//             >
//               -
//             </button>

//             <span>{qty}</span>

//             <button
//               onClick={increaseQty}
//               className="w-8 h-8 rounded-full border"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         {/* ADD TO CART */}
//         <button
//           disabled={!isInStock}
//           onClick={handleAddToCart}
//           className={`w-full py-3 rounded-xl font-semibold transition ${
//             isInStock
//               ? "bg-black text-white hover:bg-gray-800"
//               : "bg-gray-300 text-gray-500"
//           }`}
//         >
//           Add to Cart
//         </button>

//         {/* TRUST */}
//         <div className="mt-8 text-sm text-gray-500 space-y-2">
//           <p>✔ 7 Days Return</p>
//           <p>✔ Secure Payment</p>
//           <p>✔ Verified Seller</p>
//         </div>
//       </div>

//       {/* ================= DESCRIPTION SECTION ================= */}
//       <div className="lg:col-span-2 mt-16">
//         <div className="bg-white border rounded-2xl p-8 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">
//             Product Description
//           </h2>
//           <p className="text-gray-600 leading-relaxed">
//             {product.description}
//           </p>
//         </div>
//       </div>

//     </div>
//   );
// }


