// "use client";

// import { useState } from "react";
// import { useCart } from "@/app/context/cart/CartContext";
// import { fetchProductBySlug } from "@/lib/api";
// import { Product } from "@/components/product/product.types";

// type ProductPageProps = {
//   params: {
//     slug: string;
//   };
// };

// export default async function ProductPage({
//   params,
// }: ProductPageProps) {
//   const product: Product = await fetchProductBySlug(params.slug);

//   return <ProductClient product={product} />;
// }

// /* ======================================================
//    CLIENT COMPONENT
//    ====================================================== */

// function ProductClient({ product }: { product: Product }) {
//   const { dispatch } = useCart();
//   const [activeImage, setActiveImage] = useState(
//     product.images?.[0] || "/placeholder.png"
//   );

//   const hasDiscount =
//     product.originalPrice &&
//     product.originalPrice > product.price;

//   const discountPercent =
//     hasDiscount && product.originalPrice
//       ? Math.round(
//           ((product.originalPrice - product.price) /
//             product.originalPrice) *
//             100
//         )
//       : null;

//   return (
//     <main className="pt-24">
//       <div className="container mx-auto px-6 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

//           {/* ================= IMAGES ================= */}
//           <div>
//             <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
//               <img
//                 src={activeImage}
//                 alt={product.title}
//                 className="w-full h-105 object-cover"
//               />
//             </div>

//             {/* THUMBNAILS */}
//             {product.images && product.images.length > 1 && (
//               <div className="flex gap-3">
//                 {product.images.map((img) => (
//                   <button
//                     key={img}
//                     onClick={() => setActiveImage(img)}
//                     className={`w-20 h-20 rounded-lg overflow-hidden border ${
//                       activeImage === img
//                         ? "border-black"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt="thumbnail"
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ================= DETAILS ================= */}
//           <div>
//             {/* BRAND */}
//             {product.brand && (
//               <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
//                 {product.brand}
//               </p>
//             )}

//             {/* TITLE */}
//             <h1 className="text-3xl font-bold text-[#111111] mb-4">
//               {product.title}
//             </h1>

//             {/* RATING */}
//             {product.rating && (
//               <p className="text-sm text-gray-600 mb-3">
//                 ⭐ {product.rating.average} (
//                 {product.rating.count} reviews)
//               </p>
//             )}

//             {/* PRICE */}
//             <div className="flex items-center gap-4 mb-4">
//               <span className="text-3xl font-extrabold text-[#111111]">
//                 ₹{product.price}
//               </span>

//               {hasDiscount && (
//                 <>
//                   <span className="text-lg text-gray-500 line-through">
//                     ₹{product.originalPrice}
//                   </span>
//                   <span className="text-sm font-semibold text-[#D32F2F]">
//                     {discountPercent}% OFF
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* STOCK */}
//             <p
//               className={`text-sm font-medium mb-6 ${
//                 product.inStock
//                   ? "text-green-600"
//                   : "text-red-600"
//               }`}
//             >
//               {product.inStock
//                 ? "✔ In Stock — Ready to ship"
//                 : "✖ Out of Stock"}
//             </p>

//             {/* HIGHLIGHTS */}
//             {product.highlights && product.highlights.length > 0 && (
//               <ul className="list-disc pl-5 text-sm text-gray-700 mb-6 space-y-1">
//                 {product.highlights.map((point) => (
//                   <li key={point}>{point}</li>
//                 ))}
//               </ul>
//             )}

//             {/* ADD TO CART */}
//             <button
//               disabled={!product.inStock}
//               onClick={() =>
//                 dispatch({
//                   type: "ADD_TO_CART",
//                   payload: product,
//                 })
//               }
//               className={`w-full md:w-auto px-10 py-4 rounded-xl text-white font-semibold text-base transition ${
//                 product.inStock
//                   ? "bg-black hover:bg-gray-800"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               Add to Cart
//             </button>

//             {/* TRUST INFO */}
//             <div className="mt-10 space-y-2 text-sm text-gray-600">
//               <p>✔ Cash on Delivery available</p>
//               <p>✔ Quality checked products</p>
//               <p>✔ Fast & reliable delivery</p>
//               <p>✔ Easy returns & support</p>
//             </div>
//           </div>
//         </div>

//         {/* ================= DESCRIPTION ================= */}
//         {product.description && (
//           <div className="mt-20 max-w-3xl">
//             <h2 className="text-2xl font-bold mb-4">
//               Product Description
//             </h2>
//             <p className="text-gray-700 leading-relaxed">
//               {product.description}
//             </p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
