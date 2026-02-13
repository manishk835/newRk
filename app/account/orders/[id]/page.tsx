"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

const orderSteps = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          router.replace("/login?redirect=/account");
          return;
        }

        const orders = await res.json();
        const found = orders.find((o: Order) => o._id === id);
        setOrder(found || null);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-32 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 text-center">
        <p className="text-lg font-medium mb-4">
          Order not found
        </p>
        <Link href="/account" className="underline text-black">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = orderSteps.indexOf(order.status);

  return (
    <main className="bg-gray-100 min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">

        <Link
          href="/account"
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <p className="text-xs text-gray-500">
                Order ID
              </p>
              <p className="font-semibold text-lg">
                #{order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <span className="px-4 py-2 text-sm rounded-full bg-black text-white">
                {order.status}
              </span>
            </div>
          </div>

          {/* TRACKING TIMELINE */}
          <div className="mb-10">
            <h3 className="font-semibold mb-6">
              Order Progress
            </h3>

            <div className="flex items-center justify-between">
              {orderSteps.map((step, index) => (
                <div key={step} className="flex-1 text-center relative">

                  {/* LINE */}
                  {index !== orderSteps.length - 1 && (
                    <div className="absolute top-3 left-1/2 w-full h-0.5 bg-gray-200"></div>
                  )}

                  {/* DOT */}
                  <div
                    className={`w-6 h-6 mx-auto rounded-full ${
                      index <= currentStepIndex
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>

                  <p className="text-xs mt-2">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ITEMS */}
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between text-lg font-semibold mt-8">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

        </div>
      </div>
    </main>
  );
}



// // app/account/orders/[id]page.tsx


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";

// type OrderItem = {
//   title: string;
//   price: number;
//   quantity: number;
// };

// type Order = {
//   _id: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// };

// export default function OrderDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const phone = localStorage.getItem("userPhone");
//     if (!phone) {
//       router.push("/login");
//       return;
//     }

//     const fetchOrder = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/orders/${id}?phone=${phone}`,
//           { cache: "no-store" }
//         );

//         if (!res.ok) {
//           setOrder(null);
//           return;
//         }

//         const data = await res.json();
//         setOrder(data);
//       } catch {
//         setOrder(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [id, router]);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-6 pt-28">
//         Loading order...
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="container mx-auto px-6 pt-28">
//         <p className="text-gray-600">Order not found.</p>
//       </div>
//     );
//   }

//   return (
//     <main className="pt-24 bg-[#FAFAFA] min-h-screen">
//       <div className="container mx-auto px-6 py-12 max-w-3xl">
//         <Link
//           href="/account"
//           className="text-sm text-gray-600 hover:underline"
//         >
//           ← Back to Orders
//         </Link>

//         <div className="bg-white border rounded-2xl p-6 mt-4">
//           {/* HEADER */}
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <p className="text-sm text-gray-500">Order ID</p>
//               <p className="font-semibold">
//                 #{order._id.slice(-6)}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 {new Date(order.createdAt).toLocaleString()}
//               </p>
//             </div>

//             <span
//               className={`text-sm font-medium px-3 py-1 rounded-full ${
//                 order.status === "Delivered"
//                   ? "bg-green-100 text-green-700"
//                   : order.status === "Cancelled"
//                   ? "bg-red-100 text-red-700"
//                   : "bg-yellow-100 text-yellow-700"
//               }`}
//             >
//               {order.status}
//             </span>
//           </div>

//           {/* ITEMS */}
//           <div className="space-y-3 mb-6">
//             {order.items.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between text-sm border-b pb-2"
//               >
//                 <span>
//                   {item.title} × {item.quantity}
//                 </span>
//                 <span>₹{item.price * item.quantity}</span>
//               </div>
//             ))}
//           </div>

//           {/* TOTAL */}
//           <div className="flex justify-between font-semibold text-lg">
//             <span>Total</span>
//             <span>₹{order.totalAmount}</span>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
