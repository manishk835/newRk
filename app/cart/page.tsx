"use client";

import Link from "next/link";
import { useCart } from "@/app/context/cart/CartContext";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const totalAmount = state.items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  /* ================= EMPTY CART ================= */
  if (state.items.length === 0) {
    return (
      <main className="pt-24">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-10">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => {
              const image =
                item.product.thumbnail ||
                item.product.images?.[0] ||
                "/placeholder.png";

              return (
                <div
                  key={item.product._id}
                  className="flex gap-4 border rounded-2xl p-4"
                >
                  {/* IMAGE */}
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {item.product.title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      ₹{item.product.price}
                    </p>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "DECREASE_QTY",
                            payload: item.product._id,
                          })
                        }
                        className="w-8 h-8 border rounded-lg"
                      >
                        −
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch({
                            type: "INCREASE_QTY",
                            payload: item.product._id,
                          })
                        }
                        className="w-8 h-8 border rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: item.product._id,
                      })
                    }
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="border rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Delivery</span>
              <span className="text-green-600">
                Free
              </span>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <Link
              href="/checkout"
              className="block text-center w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </Link>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Cash on Delivery available
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
