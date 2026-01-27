"use client";

import { useCart } from "@/app/context/cart/CartContext";
import { Product } from "@/components/product/product.types";

export default function ProductClient({
  product,
}: {
  product: Product;
}) {
  const { dispatch } = useCart();

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
    <div className="container mx-auto px-6 pt-28 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* IMAGE SECTION */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div>
          {/* TITLE */}
          <h1 className="text-3xl font-bold text-[#111111] mb-3">
            {product.title}
          </h1>

          {/* PRICE */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-2xl font-extrabold text-[#111111]">
              ₹{product.price}
            </span>

            {hasDiscount && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-sm font-semibold text-[#D32F2F]">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* STOCK */}
          <p
            className={`text-sm font-medium mb-5 ${
              product.inStock
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.inStock
              ? "✔ In Stock — Ready to ship"
              : "✖ Out of Stock"}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-700 leading-relaxed mb-6">
            Premium quality fabric with a comfortable fit.
            Perfect for daily wear as well as special occasions.
          </p>

          {/* CTA */}
          <button
            disabled={!product.inStock}
            onClick={() =>
              dispatch({
                type: "ADD_TO_CART",
                payload: product,
              })
            }
            className={`w-full md:w-auto px-10 py-4 rounded-xl text-white font-semibold text-base transition ${
              product.inStock
                ? "bg-[#111111] hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>

          {/* TRUST INFO */}
          <div className="mt-8 space-y-2 text-sm text-gray-600">
            <p>✔ Cash on Delivery available</p>
            <p>✔ Quality checked products</p>
            <p>✔ Fast & reliable delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useCart } from "@/app/context/cart/CartContext";
// import { Product } from "@/components/product/product.types";

// export default function ProductClient({
//   product,
// }: {
//   product: Product;
// }) {
//   const { dispatch } = useCart();

//   const hasDiscount =
//     product.originalPrice && product.originalPrice > product.price;

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-12">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {/* IMAGE */}
//         <div className="bg-gray-100 rounded-lg overflow-hidden">
//           <img
//             src={product.image}
//             alt={product.title}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* DETAILS */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             {product.title}
//           </h1>

//           <div className="mt-3 flex items-center gap-3">
//             <span className="text-xl font-semibold text-gray-900">
//               ₹{product.price}
//             </span>

//             {hasDiscount && (
//               <span className="text-gray-500 line-through">
//                 ₹{product.originalPrice}
//               </span>
//             )}
//           </div>

//           <p
//             className={`mt-2 text-sm ${
//               product.inStock
//                 ? "text-green-600"
//                 : "text-red-600"
//             }`}
//           >
//             {product.inStock ? "In Stock" : "Out of Stock"}
//           </p>

//           <p className="mt-6 text-gray-700">
//             High-quality fabric, comfortable fit, suitable for daily
//             and festive wear.
//           </p>

//           <button
//             disabled={!product.inStock}
//             onClick={() =>
//               dispatch({
//                 type: "ADD_TO_CART",
//                 payload: product,
//               })
//             }
//             className={`mt-6 px-6 py-3 rounded-lg text-white ${
//               product.inStock
//                 ? "bg-black hover:bg-gray-800"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
