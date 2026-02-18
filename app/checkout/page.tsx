"use client";

import { useEffect, useState, useMemo } from "react";
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

  /* ================= SELECTED CART ================= */

  const selectedCart = useMemo(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(
      sessionStorage.getItem("selectedCart") || "[]"
    );
  }, []);

  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  /* ================= CART EMPTY GUARD ================= */

  useEffect(() => {
    if (!authLoading && selectedCart.length === 0) {
      router.replace("/cart");
    }
  }, [selectedCart.length, authLoading, router]);

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

  /* ================= TOTAL CALCULATION ================= */

  const subtotal = selectedCart.reduce(
    (sum: number, i: any) =>
      sum + i.product.price * i.quantity,
    0
  );

  const deliveryFee = subtotal >= 999 ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  /* ======================================================
     STEP 1 → CREATE ORDER
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
          items: selectedCart.map((i: any) => ({
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
     RAZORPAY FLOW
  ====================================================== */

  const handleRazorpayPayment = async (orderId: string) => {
    try {
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
        name: "RK Fashion House",
        description: "Order Payment",
        order_id: rpData.id,

        handler: async function (response: any) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders/razorpay/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                ...response,
                orderId,
              }),
            }
          );

          clearOrderedItems();
          router.push(`/order-success/${orderId}`);
        },

        prefill: {
          name: selectedAddress?.name,
          contact: selectedAddress?.phone,
        },

        theme: { color: "#000000" },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch {
      setError("Payment failed. Try again.");
    }
  };

  /* ================= CLEAR ONLY ORDERED ITEMS ================= */

  const clearOrderedItems = () => {
    const remaining = state.items.filter(
      (item) =>
        !selectedCart.find(
          (sc: any) => sc.product._id === item.product._id
        )
    );

    dispatch({ type: "SET_CART", payload: { items: remaining } });
    sessionStorage.removeItem("selectedCart");
  };

  /* ======================================================
     PLACE ORDER
  ====================================================== */

  const handleOrder = async () => {
    if (!selectedAddress) {
      setError("Please select delivery address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const order = await createOrderInDB();

      if (paymentMethod === "COD") {
        clearOrderedItems();
        router.push(`/order-success/${order._id}`);
      } else {
        await handleRazorpayPayment(order._id);
      }
    } catch {
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="pt-28 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">
              Delivery Address
            </h2>

            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`border rounded-xl p-4 flex gap-4 cursor-pointer transition ${
                  selectedAddress?._id === addr._id
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => setSelectedAddress(addr)}
                />

                <div>
                  <p className="font-semibold">
                    {addr.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-sm">
                    📞 {addr.phone}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-6">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-3">
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

        {/* RIGHT SUMMARY */}
        <aside className="bg-white rounded-2xl p-6 shadow-sm border h-fit sticky top-28">
          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          {selectedCart.map((item: any) => (
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

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Delivery</span>
            <span>
              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
            </span>
          </div>

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            onClick={handleOrder}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </aside>
      </div>
    </main>
  );
}
