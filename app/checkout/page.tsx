"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart/CartContext";
import { useAuth } from "@/app/providers/AuthProvider";

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "RAZORPAY">("COD");

  const [error, setError] = useState("");
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  /* ================= AUTO FILL ================= */
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone,
      }));
    }
  }, [user]);

  /* ================= CART EMPTY GUARD ================= */
  useEffect(() => {
    if (!authLoading && state.items.length === 0) {
      router.replace("/cart");
    }
  }, [state.items.length, authLoading, router]);

  if (authLoading || !user) return null;

  const totalAmount = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      setError("Please fill all delivery details");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter valid 10 digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter valid 6 digit pincode");
      return false;
    }

    setError("");
    return true;
  };

  /* ================= CREATE ORDER ================= */
  const createOrderInDB = async (
    method: "COD" | "RAZORPAY"
  ) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer: form,
          items: state.items.map((i) => ({
            productId: i.product._id,
            title: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
          })),
          totalAmount,
          paymentMethod: method,
          paymentStatus:
            method === "COD" ? "PENDING" : "INITIATED",
        }),
      }
    );

    if (!res.ok) throw new Error("Order creation failed");

    return res.json();
  };

  const handleOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        await createOrderInDB("COD");
        dispatch({ type: "SET_CART", payload: { items: [] } });
        router.push("/order-success");
      } else {
        alert("Razorpay integration ready here");
      }
    } catch (err) {
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* Delivery Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-5">
              Delivery Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />

              <input
                placeholder="Mobile Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />

              <input
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pincode: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <textarea
              placeholder="Full Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="border mt-4 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-black outline-none"
              rows={3}
            />

            {error && (
              <p className="text-sm text-red-600 mt-4">
                {error}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() =>
                    setPaymentMethod("RAZORPAY")
                  }
                />
                UPI / Card (Razorpay)
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit sticky top-28">
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

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            disabled={loading}
            onClick={handleOrder}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 transition"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
