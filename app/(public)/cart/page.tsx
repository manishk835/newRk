"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";


export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<string[]>(
    state.items.map((item) => item.product._id)
  );

  /* ================= SELECT HANDLERS ================= */

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === state.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(state.items.map((i) => i.product._id));
    }
  };

  /* ================= CALCULATIONS ================= */

  const selectedCartItems = useMemo(
    () =>
      state.items.filter((item) =>
        selectedItems.includes(item.product._id)
      ),
    [state.items, selectedItems]
  );

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const FREE_SHIPPING_LIMIT = 999;
  const deliveryFee =
    subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0
      ? 0
      : 49;

  const total = subtotal + deliveryFee;

  /* ================= CHECKOUT ================= */

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) return;

    sessionStorage.setItem(
      "selectedCart",
      JSON.stringify(selectedCartItems)
    );

    router.push("account/checkout");
  };

  /* ================= EMPTY CART ================= */

  if (state.items.length === 0) {
    return (
      <main className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Your cart is empty
        </h2>
        <Link
          href="/products"
          className="px-8 py-3 bg-black text-white rounded-xl"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">

        {/* ================= LEFT ================= */}

        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">
              Shopping Bag ({state.items.length})
            </h1>

            <button
              onClick={toggleSelectAll}
              className="text-sm underline"
            >
              {selectedItems.length === state.items.length
                ? "Unselect All"
                : "Select All"}
            </button>
          </div>

          {state.items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-2xl p-6 flex gap-6 shadow-sm border"
            >
              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={selectedItems.includes(
                  item.product._id
                )}
                onChange={() =>
                  toggleSelect(item.product._id)
                }
                className="mt-2 w-5 h-5"
              />

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

                {/* QTY */}
                <div className="flex items-center gap-5 mt-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "DECREASE_QTY",
                          payload: item.product._id,
                        })
                      }
                      className="px-4 py-2"
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
                      className="px-4 py-2"
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
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* PRICE */}
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ₹
                  {item.product.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* ================= SUMMARY ================= */}

        <aside className="bg-white rounded-2xl p-6 h-fit sticky top-28 shadow-sm border">
          <h3 className="text-lg font-semibold mb-5">
            Order Summary
          </h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span>
              {deliveryFee === 0
                ? "FREE"
                : `₹${deliveryFee}`}
            </span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            disabled={selectedCartItems.length === 0}
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Proceed to Checkout (
            {selectedCartItems.length})
          </button>
        </aside>
      </div>
    </main>
  );
}
