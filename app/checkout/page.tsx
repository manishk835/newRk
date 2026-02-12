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

  /* ================= AUTO FILL USER ================= */
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
      alert("Please fill all delivery details");
      return false;
    }

    if (form.phone.length !== 10 || form.pincode.length !== 6) {
      alert("Invalid phone or pincode");
      return false;
    }

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

    if (!res.ok) {
      if (res.status === 401) {
        router.replace("/login?redirect=/checkout");
        return null;
      }
      throw new Error("Order creation failed");
    }

    return res.json();
  };

  /* ================= COD FLOW ================= */
  const handleCOD = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const order = await createOrderInDB("COD");
      if (!order) return;

      dispatch({ type: "SET_CART", payload: { items: [] } });
      router.push("/order-success");
    } catch {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RAZORPAY FLOW ================= */
  const payWithRazorpay = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const dbOrder = await createOrderInDB("RAZORPAY");
      if (!dbOrder?._id) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/razorpay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderId: dbOrder._id })
        }
      );

      if (!res.ok) throw new Error("Razorpay failed");

      const razorpayOrder = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "RK Fashion House",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
                orderId: dbOrder._id,
              }),
            }
          );

          dispatch({ type: "SET_CART", payload: { items: [] } });
          router.push("/order-success");
        },
        theme: { color: "#facc15" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <main className="pt-24 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded">
            <h2 className="font-semibold mb-3">
              Delivery Details
            </h2>

            {["name", "phone", "city", "pincode"].map((f) => (
              <input
                key={f}
                name={f}
                placeholder={f}
                value={(form as any)[f]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f]: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded mb-3"
              />
            ))}

            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="bg-white p-5 rounded space-y-2">
            <label>
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />{" "}
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />{" "}
              UPI / Card (Razorpay)
            </label>
          </div>
        </div>

        <div className="bg-white p-5 rounded h-fit">
          <button
            disabled={loading}
            onClick={
              paymentMethod === "COD"
                ? handleCOD
                : payWithRazorpay
            }
            className="w-full bg-yellow-400 py-3 font-semibold rounded"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          <div className="mt-4 text-sm">
            {state.items.map((i) => (
              <div
                key={i.product._id}
                className="flex justify-between"
              >
                <span>
                  {i.product.title} × {i.quantity}
                </span>
                <span>
                  ₹{i.product.price * i.quantity}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
