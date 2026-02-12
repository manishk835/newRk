"use client";

import Link from "next/link";
import { useCart } from "@/app/context/cart/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const FREE_SHIPPING_LIMIT = 999;
  const deliveryFee = subtotal >= FREE_SHIPPING_LIMIT ? 0 : 49;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  /* ================= EMPTY CART ================= */
  if (state.items.length === 0) {
    return (
      <main className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet
        </p>

        <Link
          href="/products"
          className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">

        {/* ================= LEFT : ITEMS ================= */}
        <section className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-semibold">
            Shopping Bag ({state.items.length})
          </h1>

          {state.items.map((item) => {
            const image =
              item.product.thumbnail ||
              item.product.images?.[0] ||
              "/placeholder.png";

            return (
              <div
                key={item.product._id}
                className="bg-white rounded-2xl p-6 flex gap-6 shadow-sm"
              >
                {/* IMAGE */}
                <img
                  src={
                    item.product.images?.[0]?.url ||
                    item.product.thumbnail ||
                    "/placeholder.png"
                  }
                  alt={item.product.title}
                  className="w-28 h-36 object-contain rounded-lg border"
                />


                {/* DETAILS */}
                <div className="flex-1">
                  <h2 className="font-semibold text-base">
                    {item.product.title}
                  </h2>

                  <p className="text-sm text-green-600 mt-1">
                    In Stock
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Eligible for Free Delivery • Easy Returns
                  </p>

                  {/* QTY CONTROL */}
                  <div className="flex items-center gap-5 mt-4">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "DECREASE_QTY",
                            payload: item.product._id,
                          })
                        }
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-5 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "INCREASE_QTY",
                            payload: item.product._id,
                          })
                        }
                        className="px-4 py-2 hover:bg-gray-100"
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
        <aside className="bg-white rounded-2xl p-6 h-fit sticky top-28 shadow-sm">
          <h3 className="text-lg font-semibold mb-5">
            Order Summary
          </h3>

          {/* FREE SHIPPING MESSAGE */}
          {subtotal < FREE_SHIPPING_LIMIT && (
            <div className="bg-yellow-50 text-yellow-700 text-sm p-3 rounded-lg mb-4">
              Add ₹{FREE_SHIPPING_LIMIT - subtotal} more
              to get FREE shipping 🚚
            </div>
          )}

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span>
              {deliveryFee === 0 ? (
                <span className="text-green-600">
                  FREE
                </span>
              ) : (
                `₹${deliveryFee}`
              )}
            </span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            Proceed to Checkout
          </button>

          <p className="text-xs text-gray-500 mt-5 text-center">
            🔒 100% Secure Payments • COD Available • Easy Returns
          </p>
        </aside>
      </div>

      {/* ================= MOBILE STICKY BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center lg:hidden">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-semibold text-lg">₹{total}</p>
        </div>

        <button
          onClick={handleCheckout}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
        >
          Checkout
        </button>
      </div>
    </main>
  );
}
