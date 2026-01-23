"use client";

import Link from "next/link";
import { useCart } from "../context/cart/CartContext";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-28 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {state.items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border rounded-lg p-4"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-medium">{item.product.title}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.product.price}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "DECREASE_QTY",
                        payload: item.product.id,
                      })
                    }
                    className="px-2 border rounded"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch({
                        type: "INCREASE_QTY",
                        payload: item.product.id,
                      })
                    }
                    className="px-2 border rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: item.product.id,
                      })
                    }
                    className="ml-4 text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>{state.items.length}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
