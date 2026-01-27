"use client";

import { useCart } from "@/app/context/cart/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-6 pt-28 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Your cart is empty
        </h1>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {state.items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border rounded-xl p-4"
            >
              {/* IMAGE */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.product.image}
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

                {/* QUANTITY */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "DECREASE_QTY",
                        payload: item.product.id,
                      })
                    }
                    className="w-8 h-8 border rounded"
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
                        payload: item.product.id,
                      })
                    }
                    className="w-8 h-8 border rounded"
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
                    payload: item.product.id,
                  })
                }
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="border rounded-xl p-6 h-fit">
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
  );
}
