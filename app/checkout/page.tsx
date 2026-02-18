// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart/CartContext";
import { useAuth } from "@/app/providers/AuthProvider";

type Address = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "RAZORPAY">("COD");

  const [error, setError] = useState("");

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ================= CART EMPTY GUARD ================= */
  useEffect(() => {
    if (!authLoading && state.items.length === 0) {
      router.replace("/cart");
    }
  }, [state.items.length, authLoading, router]);

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setAddresses(data);
        const defaultAddr =
          data.find((a: Address) => a.isDefault) || data[0];

        setSelectedAddress(defaultAddr || null);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchAddresses();
  }, [user]);

  if (authLoading || !user) return null;

  const totalAmount = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  /* ======================================================
     STEP 1 → CREATE ORDER IN DB (ALWAYS FIRST)
  ====================================================== */
  const createOrderInDB = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer: selectedAddress,
          items: state.items.map((i) => ({
            productId: i.product._id,
            title: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
          })),
          paymentMethod,
        }),
      }
    );
  
    if (!res.ok) throw new Error("Order creation failed");
  
    return res.json();
  };
  

  /* ======================================================
     STEP 2 → RAZORPAY PAYMENT FLOW
  ====================================================== */
  const handleRazorpayPayment = async (orderId: string) => {
    try {
      // 🔐 Get Razorpay order from backend
      const rpRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/razorpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderId }),
        }
      );

      const rpData = await rpRes.json();
      if (!rpRes.ok) throw new Error(rpData.message);

      const options: any = {
        key: rpData.key,
        amount: rpData.amount,
        currency: rpData.currency,
        name: "RK Fashion",
        description: "Order Payment",
        order_id: rpData.id,

        handler: async function (response: any) {
          // 🔐 Verify Payment
          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders/razorpay/verify`,
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
                orderId,
              }),
            }
          );

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok)
            throw new Error(verifyData.message);

          dispatch({ type: "SET_CART", payload: { items: [] } });
          router.push("/order-success");
        },

        prefill: {
          name: selectedAddress?.name,
          contact: selectedAddress?.phone,
        },

        theme: { color: "#000000" },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    }
  };

  /* ======================================================
     FINAL PLACE ORDER HANDLER
  ====================================================== */
  const handleOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const order = await createOrderInDB();
  
      if (paymentMethod === "COD") {
        dispatch({ type: "SET_CART", payload: { items: [] } });
        router.push(`/order-success/${order._id}`);
      } else {
        await handleRazorpayPayment(order._id);
      }
    } catch (err) {
      console.error(err);
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Delivery Address
            </h2>

            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`border rounded-xl p-4 flex gap-3 cursor-pointer ${
                  selectedAddress?._id === addr._id
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => setSelectedAddress(addr)}
                />
                <div className="text-sm">
                  <p className="font-semibold">
                    {addr.name}
                  </p>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city} - {addr.pincode}
                  </p>
                  <p>📞 {addr.phone}</p>
                </div>
              </label>
            ))}

            {error && (
              <p className="text-red-600 mt-4 text-sm">
                {error}
              </p>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment Method
            </h2>

            <label className="flex items-center gap-2 cursor-pointer mb-2">
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

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit sticky top-28">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          {state.items.map((item) => (
            <div
              key={item.product._id}
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

          <button
            disabled={loading}
            onClick={handleOrder}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
