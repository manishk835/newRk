"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  /* ================= UNIQUE ID (VARIANT SAFE) ================= */
  const getItemId = (item: any) =>
    `${item.product._id}-${item.variant.size}-${item.variant.color}`;

  const [selectedItems, setSelectedItems] = useState<string[]>(
    state.items.map(getItemId)
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
      setSelectedItems(state.items.map(getItemId));
    }
  };

  /* ================= CALCULATIONS ================= */

  const selectedCartItems = useMemo(
    () =>
      state.items.filter((item) =>
        selectedItems.includes(getItemId(item))
      ),
    [state.items, selectedItems]
  );

  const subtotal = selectedCartItems.reduce(
    (sum, item) =>
      sum +
      (item.variant.priceOverride || item.product.price) *
        item.quantity,
    0
  );

  const deliveryFee =
    subtotal >= 999 || subtotal === 0 ? 0 : 49;

  const total = subtotal + deliveryFee;

  /* ================= CHECKOUT ================= */

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) return;

    sessionStorage.setItem(
      "selectedCart",
      JSON.stringify(selectedCartItems)
    );

    router.push("checkout");
  };

  /* ================= EMPTY CART ================= */

  if (state.items.length === 0) {
    return (
      <main className="pt-32 min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center text-center transition-colors duration-300">

        <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">
          Your cart is empty
        </h2>

        <Link
          href="/products"
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl transition"
        >
          Continue Shopping
        </Link>

      </main>
    );
  }

  return (
    <main className="pt-28 bg-gray-100 dark:bg-black min-h-screen transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">

        {/* ================= LEFT ================= */}

        <section className="lg:col-span-2 space-y-6">

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              Shopping Bag ({state.items.length})
            </h1>

            <button
              onClick={toggleSelectAll}
              className="text-sm underline text-black dark:text-white"
            >
              {selectedItems.length === state.items.length
                ? "Unselect All"
                : "Select All"}
            </button>
          </div>

          {state.items.map((item) => {
            const id = getItemId(item);

            const price =
              item.variant.priceOverride ||
              item.product.price;

            return (
              <div
                key={id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex gap-6 shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors duration-300"
              >

                {/* CHECKBOX */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(id)}
                  onChange={() => toggleSelect(id)}
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
                  className="w-28 h-36 object-contain rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />

                {/* DETAILS */}
                <div className="flex-1">

                  <h2 className="font-semibold text-base text-black dark:text-white">
                    {item.product.title}
                  </h2>

                  {/* VARIANT INFO */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Size: {item.variant.size} | Color:{" "}
                    {item.variant.color}
                  </p>

                  {/* STOCK */}
                  <p
                    className={`text-sm mt-1 ${
                      item.variant.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.variant.stock > 0
                      ? `In Stock (${item.variant.stock} left)`
                      : "Out of Stock"}
                  </p>

                  {/* QTY */}
                  <div className="flex items-center gap-5 mt-4">

                    <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">

                      <button
                        onClick={() =>
                          dispatch({
                            type: "DECREASE_QTY",
                            payload: {
                              productId: item.product._id,
                              size: item.variant.size,
                              color: item.variant.color,
                            },
                          })
                        }
                        className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                      >
                        −
                      </button>

                      <span className="px-5 font-medium text-black dark:text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch({
                            type: "INCREASE_QTY",
                            payload: {
                              productId: item.product._id,
                              size: item.variant.size,
                              color: item.variant.color,
                            },
                          })
                        }
                        className="px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_FROM_CART",
                          payload: {
                            productId: item.product._id,
                            size: item.variant.size,
                            color: item.variant.color,
                          },
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
                  <p className="text-lg font-semibold text-black dark:text-white">
                    ₹{price * item.quantity}
                  </p>
                </div>

              </div>
            );
          })}
        </section>

        {/* ================= SUMMARY ================= */}

        <aside className="bg-white dark:bg-zinc-900 rounded-2xl p-6 h-fit sticky top-28 shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors duration-300">

          <h3 className="text-lg font-semibold mb-5 text-black dark:text-white">
            Order Summary
          </h3>

          <div className="flex justify-between text-sm mb-2 text-gray-700 dark:text-gray-300">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2 text-gray-700 dark:text-gray-300">
            <span>Delivery</span>

            <span>
              {deliveryFee === 0
                ? "FREE"
                : `₹${deliveryFee}`}
            </span>
          </div>

          <hr className="my-4 border-gray-200 dark:border-zinc-700" />

          <div className="flex justify-between text-lg font-semibold mb-6 text-black dark:text-white">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            disabled={selectedCartItems.length === 0}
            onClick={handleCheckout}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-semibold disabled:opacity-50 transition"
          >
            Proceed to Checkout ({selectedCartItems.length})
          </button>

        </aside>

      </div>
    </main>
  );
}