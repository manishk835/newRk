// ======================================================
// 📄 app/(user)/checkout/page.tsx
// ======================================================

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/CartContext";
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  /* ================= ADD ADDRESS STATE ================= */

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  /* ======================================================
     SAFE SELECTED CART
  ====================================================== */

  const selectedCart = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        sessionStorage.getItem("selectedCart") || "[]"
      );
    } catch {
      return [];
    }
  }, []);

  /* ======================================================
     AUTH GUARD
  ====================================================== */

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  /* ======================================================
     EMPTY CART GUARD
  ====================================================== */

  useEffect(() => {
    if (!authLoading && selectedCart.length === 0) {
      router.replace("/cart");
    }
  }, [selectedCart.length, authLoading, router]);

  /* ======================================================
     LOAD ADDRESSES
  ====================================================== */

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setAddresses(data || []);

      const defaultAddr =
        data.find((a: Address) => a.isDefault) || data[0];

      setSelectedAddress(defaultAddr || null);
    } catch {
      setError("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  /* ======================================================
     ADDRESS VALIDATION
  ====================================================== */

  const validateAddress = () => {
    if (!form.name.trim()) return "Name required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      return "Enter valid 10 digit mobile number";
    if (!form.address.trim()) return "Address required";
    if (!form.city.trim()) return "City required";
    if (!/^\d{6}$/.test(form.pincode))
      return "Enter valid 6 digit pincode";
    return "";
  };

  /* ======================================================
     SAVE ADDRESS
  ====================================================== */

  const saveAddress = async () => {
    const validationError = validateAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmittingAddress(true);
      setError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setAddresses((prev) => [data, ...prev]);
      setSelectedAddress(data);

      setShowAddressForm(false);

      setForm({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingAddress(false);
    }
  };

  /* ======================================================
     FRONTEND TOTAL
  ====================================================== */

  const subtotal = selectedCart.reduce(
    (sum: number, i: any) =>
      sum + i.product.price * i.quantity,
    0
  );

  const deliveryFee = subtotal >= 999 ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  /* ======================================================
     CREATE ORDER
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
            quantity: i.quantity,
          })),
          paymentMethod,
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Order failed");
    }

    return res.json();
  };

  /* ======================================================
     RAZORPAY
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

      const razor = new window.Razorpay({
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

          router.push(`/account/order-success/${orderId}`);
        },

        prefill: {
          name: selectedAddress?.name,
          contact: selectedAddress?.phone,
        },

        theme: { color: "#000000" },
      });

      razor.open();

    } catch {
      setError("Payment failed");
    }
  };

  /* ======================================================
     CLEAR ORDERED ITEMS
  ====================================================== */

  const clearOrderedItems = () => {

    const remaining = state.items.filter(
      (item) =>
        !selectedCart.find(
          (sc: any) => sc.product._id === item.product._id
        )
    );

    dispatch({
      type: "SET_CART",
      payload: { items: remaining },
    });

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
        router.push(`/account/order-success/${order._id}`);

      } else {

        await handleRazorpayPayment(order._id);

      }

    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="pt-28 min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-8">

          {/* ADDRESS */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-semibold">
                Delivery Address
              </h2>

              <button
                onClick={() => setShowAddressForm(true)}
                className="text-sm bg-black text-white px-4 py-2 rounded-lg"
              >
                + Add Address
              </button>

            </div>

            {addresses.map((addr) => (

              <label
                key={addr._id}
                className={`border rounded-xl p-4 flex gap-4 cursor-pointer mb-3 ${
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

                  <p className="font-semibold">{addr.name}</p>

                  <p className="text-sm text-gray-600">
                    {addr.address}
                  </p>

                  <p className="text-sm text-gray-600">
                    {addr.city} - {addr.pincode}
                  </p>

                  <p className="text-sm">📞 {addr.phone}</p>

                </div>

              </label>

            ))}

          </div>

          {/* PAYMENT */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border">

            <h2 className="text-xl font-semibold mb-6">
              Payment Method
            </h2>

            <label className="flex items-center gap-3 mb-3">

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
                onChange={() => setPaymentMethod("RAZORPAY")}
              />

              UPI / Card (Razorpay)

            </label>

          </div>

        </div>

        {/* RIGHT */}

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
            className="w-full bg-black text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </aside>

      </div>

      {/* ADDRESS MODAL */}

      {showAddressForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Add New Address
            </h2>

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            <input
              placeholder="Mobile Number"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            <textarea
              placeholder="Full Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            <input
              placeholder="Pincode"
              maxLength={6}
              value={form.pincode}
              onChange={(e) =>
                setForm({
                  ...form,
                  pincode: e.target.value.replace(/\D/g, ""),
                })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={submittingAddress}
                onClick={saveAddress}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                {submittingAddress ? "Saving..." : "Save"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}
// // ======================================================
// // 📄 app/(user)/account/checkout/page.tsx
// // ======================================================

// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/features/cart/CartContext";
// import { useAuth } from "@/app/providers/AuthProvider";

// type Address = {
//   _id: string;
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   pincode: string;
//   isDefault?: boolean;
// };

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { state, dispatch } = useCart();
//   const { user, loading: authLoading } = useAuth();

//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddress, setSelectedAddress] =
//     useState<Address | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [paymentMethod, setPaymentMethod] =
//     useState<"COD" | "RAZORPAY">("COD");

//   const [error, setError] = useState("");

//   /* ======================================================
//      SAFE SELECTED CART
//   ====================================================== */

//   const selectedCart = useMemo(() => {
//     if (typeof window === "undefined") return [];
//     try {
//       return JSON.parse(
//         sessionStorage.getItem("selectedCart") || "[]"
//       );
//     } catch {
//       return [];
//     }
//   }, []);

//   /* ======================================================
//      AUTH GUARD
//   ====================================================== */

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.replace("/login?redirect=/account/checkout");
//     }
//   }, [user, authLoading, router]);

//   /* ======================================================
//      EMPTY CART GUARD
//   ====================================================== */

//   useEffect(() => {
//     if (!authLoading && selectedCart.length === 0) {
//       router.replace("/cart");
//     }
//   }, [selectedCart.length, authLoading, router]);

//   /* ======================================================
//      LOAD ADDRESSES
//   ====================================================== */

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
//           { credentials: "include" }
//         );

//         if (!res.ok) throw new Error();

//         const data = await res.json();
//         setAddresses(data || []);

//         const defaultAddr =
//           data.find((a: Address) => a.isDefault) || data[0];

//         setSelectedAddress(defaultAddr || null);
//       } catch {
//         setError("Failed to load addresses");
//       }
//     };

//     if (user) fetchAddresses();
//   }, [user]);

//   /* ======================================================
//      FRONTEND TOTAL (DISPLAY ONLY)
//      ⚠ Backend must re-calculate real amount
//   ====================================================== */

//   const subtotal = selectedCart.reduce(
//     (sum: number, i: any) =>
//       sum + i.product.price * i.quantity,
//     0
//   );

//   const deliveryFee = subtotal >= 999 ? 0 : 49;
//   const totalAmount = subtotal + deliveryFee;

//   /* ======================================================
//      CREATE ORDER (SERVER VALIDATION HAPPENS HERE)
//   ====================================================== */

//   const createOrderInDB = async () => {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           customer: selectedAddress,
//           items: selectedCart.map((i: any) => ({
//             productId: i.product._id,
//             quantity: i.quantity,
//           })),
//           paymentMethod,
//         }),
//       }
//     );

//     if (!res.ok) {
//       const data = await res.json();
//       throw new Error(data?.message || "Order failed");
//     }

//     return res.json();
//   };

//   /* ======================================================
//      RAZORPAY FLOW
//   ====================================================== */

//   const handleRazorpayPayment = async (orderId: string) => {
//     try {
//       const rpRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/orders/razorpay/create`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ orderId }),
//         }
//       );

//       const rpData = await rpRes.json();
//       if (!rpRes.ok) throw new Error(rpData.message);

//       if (!window.Razorpay) {
//         setError("Payment system not loaded");
//         return;
//       }

//       const razor = new window.Razorpay({
//         key: rpData.key,
//         amount: rpData.amount,
//         currency: rpData.currency,
//         name: "RK Fashion House",
//         description: "Order Payment",
//         order_id: rpData.id,

//         handler: async function (response: any) {
//           await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/api/orders/razorpay/verify`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               credentials: "include",
//               body: JSON.stringify({
//                 ...response,
//                 orderId,
//               }),
//             }
//           );

//           clearOrderedItems();
//           router.push(`/account/order-success/${orderId}`);
//         },

//         prefill: {
//           name: selectedAddress?.name,
//           contact: selectedAddress?.phone,
//         },

//         theme: { color: "#000000" },
//       });

//       razor.open();
//     } catch {
//       setError("Payment failed. Try again.");
//     }
//   };

//   /* ======================================================
//      CLEAR ORDERED ITEMS
//   ====================================================== */

//   const clearOrderedItems = () => {
//     const remaining = state.items.filter(
//       (item) =>
//         !selectedCart.find(
//           (sc: any) => sc.product._id === item.product._id
//         )
//     );

//     dispatch({ type: "SET_CART", payload: { items: remaining } });
//     sessionStorage.removeItem("selectedCart");
//   };

//   /* ======================================================
//      PLACE ORDER
//   ====================================================== */

//   const handleOrder = async () => {
//     if (loading) return;

//     if (!selectedAddress) {
//       setError("Please select delivery address");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const order = await createOrderInDB();

//       if (paymentMethod === "COD") {
//         clearOrderedItems();
//         router.push(`/account/order-success/${order._id}`);
//       } else {
//         await handleRazorpayPayment(order._id);
//       }
//     } catch (err: any) {
//       setError(err.message || "Order failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading || !user) return null;

//   return (
//     <main className="pt-28 min-h-screen bg-gray-100">
//       <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-8">

//           {/* ADDRESS */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm border">
//             <h2 className="text-xl font-semibold mb-6">
//               Delivery Address
//             </h2>

//             {addresses.map((addr) => (
//               <label
//                 key={addr._id}
//                 className={`border rounded-xl p-4 flex gap-4 cursor-pointer ${
//                   selectedAddress?._id === addr._id
//                     ? "border-black bg-gray-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   checked={selectedAddress?._id === addr._id}
//                   onChange={() => setSelectedAddress(addr)}
//                 />
//                 <div>
//                   <p className="font-semibold">{addr.name}</p>
//                   <p className="text-sm text-gray-600">
//                     {addr.address}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {addr.city} - {addr.pincode}
//                   </p>
//                   <p className="text-sm">📞 {addr.phone}</p>
//                 </div>
//               </label>
//             ))}
//           </div>

//           {/* PAYMENT */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm border">
//             <h2 className="text-xl font-semibold mb-6">
//               Payment Method
//             </h2>

//             <label className="flex items-center gap-3 mb-3">
//               <input
//                 type="radio"
//                 checked={paymentMethod === "COD"}
//                 onChange={() => setPaymentMethod("COD")}
//               />
//               Cash on Delivery
//             </label>

//             <label className="flex items-center gap-3">
//               <input
//                 type="radio"
//                 checked={paymentMethod === "RAZORPAY"}
//                 onChange={() => setPaymentMethod("RAZORPAY")}
//               />
//               UPI / Card (Razorpay)
//             </label>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <aside className="bg-white rounded-2xl p-6 shadow-sm border h-fit sticky top-28">
//           <h2 className="text-xl font-semibold mb-6">
//             Order Summary
//           </h2>

//           {selectedCart.map((item: any) => (
//             <div
//               key={item.product._id}
//               className="flex justify-between text-sm mb-2"
//             >
//               <span>
//                 {item.product.title} × {item.quantity}
//               </span>
//               <span>
//                 ₹{item.product.price * item.quantity}
//               </span>
//             </div>
//           ))}

//           <hr className="my-4" />

//           <div className="flex justify-between mb-2">
//             <span>Subtotal</span>
//             <span>₹{subtotal}</span>
//           </div>

//           <div className="flex justify-between mb-4">
//             <span>Delivery</span>
//             <span>
//               {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
//             </span>
//           </div>

//           <div className="flex justify-between text-lg font-semibold mb-6">
//             <span>Total</span>
//             <span>₹{totalAmount}</span>
//           </div>

//           {error && (
//             <p className="text-red-600 text-sm mb-4">
//               {error}
//             </p>
//           )}

//           <button
//             disabled={loading}
//             onClick={handleOrder}
//             className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
//           >
//             {loading ? "Processing..." : "Place Order"}
//           </button>
//         </aside>
//       </div>
//     </main>
//   );
// }