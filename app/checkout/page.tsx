"use client";

import { useState } from "react";
import { useCart } from "../context/cart/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all details");
      return;
    }

    // 🔮 Future: send order to backend
    const orderPayload = {
      customer: form,
      items: state.items,
      total: totalAmount,
      paymentMethod: "COD",
    };

    console.log("ORDER PLACED:", orderPayload);

    alert("Order placed successfully (Cash on Delivery)");

    dispatch({ type: "SET_CART", payload: { items: [] } });

    router.push("/");
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-28 text-center">
        <h1 className="text-2xl font-bold">Cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ADDRESS FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-2">
            Delivery Details
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Place Order (Cash on Delivery)
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          {state.items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between text-sm mb-2"
            >
              <span>
                {item.product.title} × {item.quantity}
              </span>
              <span>
                ₹{item.product.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Payment Method: <b>Cash on Delivery</b>
          </p>
        </div>
      </div>
    </div>
  );
}
