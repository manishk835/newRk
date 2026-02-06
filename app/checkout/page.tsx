"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart/CartContext";

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
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "RAZORPAY">("COD");

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const totalAmount = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  /* ---------------- VALIDATION ---------------- */
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

  /* ---------------- CREATE ORDER (COMMON) ---------------- */
  const createOrderInDB = async (method: "COD" | "RAZORPAY") => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          paymentStatus: method === "COD" ? "PENDING" : "INITIATED",
        }),
      }
    );

    if (!res.ok) throw new Error("Order creation failed");
    return res.json();
  };

  /* ---------------- COD ---------------- */
  const handleCOD = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      await createOrderInDB("COD");
      dispatch({ type: "SET_CART", payload: { items: [] } });
      router.push("/order-success");
    } catch {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RAZORPAY ---------------- */
  const payWithRazorpay = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      // 1️⃣ Create DB order first
      const dbOrder = await createOrderInDB("RAZORPAY");

      // 2️⃣ Create Razorpay order
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/razorpay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );

      const razorpayOrder = await res.json();

      // 3️⃣ Razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "RK Fashion Hub",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response: any) {
          // 4️⃣ Verify payment
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
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

  /* ---------------- UI ---------------- */
  return (
    <main className="pt-24 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded">
            <h2 className="font-semibold mb-3">Delivery Details</h2>

            {["name", "phone", "city", "pincode"].map((f) => (
              <input
                key={f}
                name={f}
                placeholder={f}
                value={(form as any)[f]}
                onChange={(e) =>
                  setForm({ ...form, [f]: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mb-3"
              />
            ))}

            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
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

        {/* RIGHT */}
        <div className="bg-white p-5 rounded h-fit">
          <button
            disabled={loading}
            onClick={paymentMethod === "COD" ? handleCOD : payWithRazorpay}
            className="w-full bg-yellow-400 py-3 font-semibold rounded"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          <div className="mt-4 text-sm">
            {state.items.map((i) => (
              <div key={i.product._id} className="flex justify-between">
                <span>
                  {i.product.title} × {i.quantity}
                </span>
                <span>₹{i.product.price * i.quantity}</span>
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




// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/app/context/cart/CartContext";

// type Address = {
//   _id: string;
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   pincode: string;
// };

// type CheckoutForm = {
//   name: string;
//   phone: string;
//   address: string;
//   city: string;
//   pincode: string;
// };

// export default function CheckoutPage() {
//   const { state, dispatch } = useCart();
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [paymentMethod, setPaymentMethod] =
//     useState<"COD" | "RAZORPAY">("COD");

//   // 🔹 Dummy saved address
//   const addresses: Address[] = [
//     {
//       _id: "1",
//       name: "Manish Kumar",
//       phone: "9876543210",
//       address: "Near Shiv Mandir",
//       city: "Khairthal",
//       pincode: "301404",
//     },
//   ];

//   const [form, setForm] = useState<CheckoutForm>({
//     name: "",
//     phone: "",
//     address: "",
//     city: "",
//     pincode: "",
//   });

//   const totalAmount = state.items.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     if ((name === "phone" || name === "pincode") && !/^\d*$/.test(value))
//       return;
//     setForm({ ...form, [name]: value });
//   };

//   const validateForm = () => {
//     if (
//       !form.name ||
//       !form.phone ||
//       !form.address ||
//       !form.city ||
//       !form.pincode
//     ) {
//       alert("Please fill all delivery details");
//       return false;
//     }
//     if (form.phone.length !== 10 || form.pincode.length !== 6) {
//       alert("Enter valid phone & pincode");
//       return false;
//     }
//     return true;
//   };

//   // 🔹 COMMON ORDER FUNCTION
//   const placeOrder = async (method: "COD" | "RAZORPAY") => {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customer: form,
//           items: state.items.map((i) => ({
//             productId: i.product._id,
//             title: i.product.title,
//             price: i.product.price,
//             quantity: i.quantity,
//           })),
//           totalAmount,
//           paymentMethod: method,
//           status: "Placed",
//         }),
//       }
//     );

//     if (!res.ok) throw new Error("Order failed");

//     dispatch({ type: "SET_CART", payload: { items: [] } });
//     router.push("/order-success");
//   };

//   // 🔹 COD
//   const handleCOD = async () => {
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       await placeOrder("COD");
//     } catch {
//       alert("Order failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const payWithRazorpay = async () => {
//     if (!validateForm()) return;
  
//     // 1️⃣ Backend se Razorpay order create
//     const res = await fetch("http://localhost:5000/api/payment/razorpay", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: totalAmount }),
//     });
  
//     const order = await res.json();
  
//     // 2️⃣ Razorpay options
//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
//       amount: order.amount,
//       currency: "INR",
//       name: "RK Fashion Hub",
//       description: "Order Payment",
//       order_id: order.id, // 🔥 MUST
  
//       handler: async function (response: any) {
//         try {
//           // 3️⃣ Verify payment (IMPORTANT)
//           await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 orderId: createdOrderId, // 🧠 DB order id
//               }),
//             }
//           );
  
//           // 4️⃣ Place order in DB
//           await placeOrder("RAZORPAY");
  
//           // 5️⃣ Redirect
//           router.push("/order-success");
//         } catch (err) {
//           alert("Payment verification failed");
//           console.error(err);
//         }
//       },
  
//       theme: { color: "#facc15" },
//     };
  
//     // 6️⃣ Open Razorpay popup
//     const rzp = new (window as any).Razorpay(options);
//     rzp.open();
//   };
  
  
  

//   return (
//     <main className="pt-24 bg-gray-100 min-h-screen">
//       <div className="container mx-auto px-4 py-10">
//         <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* ADDRESS */}
//             <div className="bg-white border rounded-lg p-5">
//               <h2 className="font-semibold mb-3">Select Delivery Address</h2>

//               {addresses.map((addr) => (
//                 <label
//                   key={addr._id}
//                   className="block border p-3 rounded mb-3 cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     name="address"
//                     className="mr-2"
//                     onChange={() => setForm(addr)}
//                   />
//                   <b>{addr.name}</b> — {addr.phone}
//                   <p className="text-sm text-gray-600">
//                     {addr.address}, {addr.city} - {addr.pincode}
//                   </p>
//                 </label>
//               ))}
//             </div>

//             {/* FORM */}
//             <div className="bg-white border rounded-lg p-5 space-y-4">
//               <h2 className="font-semibold">Delivery Details</h2>

//               <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
//               <input name="phone" placeholder="Phone" maxLength={10} value={form.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
//               <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
//               <div className="grid grid-cols-2 gap-4">
//                 <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border px-3 py-2 rounded" />
//                 <input name="pincode" placeholder="Pincode" maxLength={6} value={form.pincode} onChange={handleChange} className="border px-3 py-2 rounded" />
//               </div>
//             </div>

//             {/* PAYMENT */}
//             <div className="bg-white border rounded-lg p-5 space-y-3">
//               <h2 className="font-semibold">Payment Method</h2>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   checked={paymentMethod === "COD"}
//                   onChange={() => setPaymentMethod("COD")}
//                 />
//                 Cash on Delivery
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   checked={paymentMethod === "RAZORPAY"}
//                   onChange={() => setPaymentMethod("RAZORPAY")}
//                 />
//                 UPI / Card (Razorpay)
//               </label>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="bg-white border rounded-lg p-5 h-fit sticky top-28">
//             <button
//               onClick={paymentMethod === "COD" ? handleCOD : payWithRazorpay}
//               disabled={loading}
//               className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-semibold mb-4"
//             >
//               {loading ? "Processing..." : "Place Order"}
//             </button>

//             <div className="text-sm space-y-2">
//               {state.items.map((item) => (
//                 <div key={item.product._id} className="flex justify-between">
//                   <span>{item.product.title} × {item.quantity}</span>
//                   <span>₹{item.product.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <hr className="my-3" />
//             <div className="flex justify-between font-semibold">
//               <span>Total</span>
//               <span>₹{totalAmount}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
