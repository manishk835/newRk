"use client";

import Link from "next/link";
import { useCart } from "@/app/context/cart/CartContext";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const savings = Math.floor(subtotal * 0.1); // visual-only savings
  const total = subtotal - savings;

  if (state.items.length === 0) {
    return (
      <main className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">
          Add some fresh styles to your wardrobe
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Shop Now
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT : CART ITEMS ================= */}
        <section className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-semibold">Shopping Bag</h1>

          {state.items.map((item) => {
            const image =
              item.product.thumbnail ||
              item.product.images?.[0] ||
              "/placeholder.png";

            return (
              <div
                key={item.product._id}
                className="bg-white rounded-2xl p-5 flex gap-4 hover:shadow-md transition"
              >
                {/* IMAGE */}
                <img
                  src={image}
                  alt={item.product.title}
                  className="w-28 h-36 object-contain rounded-xl border"
                />

                {/* DETAILS */}
                <div className="flex-1">
                  <h2 className="font-medium text-base leading-snug">
                    {item.product.title}
                  </h2>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Trending
                    </span>
                    <span className="text-xs text-gray-500">
                      Only few left
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Free Delivery • COD Available • Easy Returns
                  </p>

                  {/* QTY + REMOVE */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "DECREASE_QTY",
                            payload: item.product._id,
                          })
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "INCREASE_QTY",
                            payload: item.product._id,
                          })
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_FROM_CART",
                          payload: item.product._id,
                        })
                      }
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* PRICE */}
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ₹{item.product.price * item.quantity}
                  </p>
                  <p className="text-xs text-gray-500">
                    ₹{item.product.price} each
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ================= RIGHT : SUMMARY ================= */}
        <aside className="bg-white rounded-2xl p-6 h-fit sticky top-28">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {/* SAVINGS STRIP */}
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">
            🎉 You saved ₹{savings} on this order
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span className="text-green-600">FREE</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Discount</span>
            <span className="text-green-600">−₹{savings}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <Link href="/checkout">
            <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition text-base font-semibold">
              Place Order • ₹{total}
            </button>
          </Link>

          <p className="text-xs text-gray-500 mt-4 text-center">
            🔒 Secure payments • Easy returns • 100% authentic
          </p>
        </aside>
      </div>

      {/* ================= MOBILE STICKY BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center lg:hidden">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-semibold text-lg">₹{total}</p>
        </div>
        <Link href="/checkout">
          <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold">
            Place Order
          </button>
        </Link>
      </div>
    </main>
  );
}


// "use client";

// import Link from "next/link";
// import { useCart } from "@/app/context/cart/CartContext";

// export default function CartPage() {
//   const { state, dispatch } = useCart();

//   const subtotal = state.items.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   if (state.items.length === 0) {
//     return (
//       <main className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
//         <h2 className="text-2xl font-semibold mb-2">
//           Your cart is empty
//         </h2>
//         <p className="text-gray-500 mb-6">
//           Looks like you haven’t added anything yet
//         </p>
//         <Link
//           href="/products"
//           className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
//         >
//           Continue Shopping
//         </Link>
//       </main>
//     );
//   }

//   return (
//     <main className="pt-28 bg-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* ================= CART ITEMS ================= */}
//         <section className="lg:col-span-2 bg-white rounded-2xl p-6">
//           <h1 className="text-2xl font-semibold mb-6">
//             Shopping Cart
//           </h1>

//           {state.items.map((item) => {
//             const image =
//               item.product.thumbnail ||
//               item.product.images?.[0] ||
//               "/placeholder.png";

//             return (
//               <div
//                 key={item.product._id}
//                 className="flex gap-4 py-6 border-t"
//               >
//                 {/* IMAGE */}
//                 <img
//                   src={image}
//                   alt={item.product.title}
//                   className="w-24 h-28 object-contain rounded-lg border"
//                 />

//                 {/* DETAILS */}
//                 <div className="flex-1">
//                   <h2 className="font-medium leading-snug">
//                     {item.product.title}
//                   </h2>

//                   <p className="text-sm text-green-700 mt-1">
//                     In stock
//                   </p>

//                   <p className="text-xs text-gray-500 mt-1">
//                     Eligible for Free Delivery • COD Available
//                   </p>

//                   <div className="flex items-center gap-4 mt-4 text-sm">
//                     {/* QTY */}
//                     <div className="flex items-center border rounded-lg overflow-hidden">
//                       <button
//                         onClick={() =>
//                           dispatch({
//                             type: "DECREASE_QTY",
//                             payload: item.product._id,
//                           })
//                         }
//                         className="px-3 py-1 hover:bg-gray-100"
//                       >
//                         −
//                       </button>
//                       <span className="px-4">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           dispatch({
//                             type: "INCREASE_QTY",
//                             payload: item.product._id,
//                           })
//                         }
//                         className="px-3 py-1 hover:bg-gray-100"
//                       >
//                         +
//                       </button>
//                     </div>

//                     <button
//                       onClick={() =>
//                         dispatch({
//                           type: "REMOVE_FROM_CART",
//                           payload: item.product._id,
//                         })
//                       }
//                       className="text-red-600 hover:underline"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>

//                 {/* PRICE */}
//                 <div className="text-right">
//                   <p className="font-semibold text-lg">
//                     ₹{item.product.price * item.quantity}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     ₹{item.product.price} each
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </section>

//         {/* ================= SUMMARY ================= */}
//         <aside className="bg-white rounded-2xl p-6 h-fit sticky top-28">
//           <h3 className="text-lg font-semibold mb-4">
//             Order Summary
//           </h3>

//           <div className="flex justify-between text-sm mb-2">
//             <span>Subtotal</span>
//             <span>₹{subtotal}</span>
//           </div>

//           <div className="flex justify-between text-sm mb-2">
//             <span>Delivery</span>
//             <span className="text-green-600">FREE</span>
//           </div>

//           <hr className="my-4" />

//           <div className="flex justify-between text-lg font-semibold mb-6">
//             <span>Total</span>
//             <span>₹{subtotal}</span>
//           </div>

//           <Link href="/checkout">
//             <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg">
//               Proceed to Checkout
//             </button>
//           </Link>

//           <p className="text-xs text-gray-500 mt-4 text-center">
//             🔒 Secure checkout • Easy returns • COD available
//           </p>
//         </aside>
//       </div>
//     </main>
//   );
// }