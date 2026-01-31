"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart/CartContext";
import { createOrder } from "@/lib/api";

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all delivery details");
      return;
    }
  
    setLoading(true);
  
    const orderPayload = {
      customer: form,
      items: state.items.map((item) => ({
        productId: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod: "COD",
      status: "Placed",
    };
  
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
  
      if (!res.ok) throw new Error();
  
  
      // ✅ CLEAR CART
      dispatch({ type: "SET_CART", payload: { items: [] } });
  
      // ✅ GO TO SUCCESS PAGE
      router.push("/order-success");
  
    } catch (err) {
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-6 pt-28 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-gray-600 mt-2">
          Add items to your cart before checkout.
        </p>
      </div>
    );
  }

  return (
    <main className="pt-24">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-10">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ================= DELIVERY FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="border rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold mb-2">
              Delivery Details
            </h2>

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading
                ? "Placing Order..."
                : "Place Order (Cash on Delivery)"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              100% secure checkout • COD available
            </p>
          </form>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="border rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              {state.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between"
                >
                  <span>
                    {item.product.title} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

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

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Payment Method: <b>Cash on Delivery</b>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
