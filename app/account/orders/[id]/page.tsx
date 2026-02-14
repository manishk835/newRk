"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

type StatusHistoryItem = {
  status: string;
  updatedAt: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
  isReturnRequested?: boolean;
  statusHistory?: StatusHistoryItem[];
};

const orderSteps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* ================= FETCH ORDER ================= */
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
          router.replace("/login?redirect=/account/orders");
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

  /* ================= ACTIONS ================= */
  const handleCancel = async () => {
    if (!order) return;

    setActionLoading(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
        { method: "PUT", credentials: "include" }
      );

      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!order) return;

    setActionLoading(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/return`,
        { method: "PUT", credentials: "include" }
      );

      router.refresh();
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20 animate-pulse">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold mb-3">
          Order not found
        </h2>
        <Link
          href="/account/orders"
          className="underline text-black"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex =
    order.status === "Cancelled"
      ? -1
      : orderSteps.indexOf(order.status);

  /* ================= UI ================= */
  return (
    <div className="space-y-8">

      {/* Back */}
      <Link
        href="/account/orders"
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to Orders
      </Link>

      <div className="bg-white border rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="font-semibold text-lg">
              #{order._id.slice(-6)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <span
            className={`px-4 py-2 text-sm font-medium rounded-full h-fit ${
              statusStyles[order.status] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* ================= TRACKING TIMELINE ================= */}
        {order.status !== "Cancelled" && (
          <div className="mb-14">
            <h3 className="font-semibold mb-10 text-lg">
              Order Progress
            </h3>

            <div className="relative">

              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

              <div
                className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-all duration-700"
                style={{
                  width:
                    currentStepIndex >= 0
                      ? `${
                          (currentStepIndex /
                            (orderSteps.length - 1)) *
                          100
                        }%`
                      : "0%",
                }}
              />

              <div className="flex justify-between">
                {orderSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent =
                    index === currentStepIndex;

                  const historyItem =
                    order.statusHistory?.find(
                      (h) => h.status === step
                    );

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-black text-white animate-pulse"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isCompleted ? "✔" : index + 1}
                      </div>

                      <p className="text-xs mt-3 font-medium">
                        {step}
                      </p>

                      {historyItem && (
                        <p className="text-[11px] text-gray-500 mt-1">
                          {new Date(
                            historyItem.updatedAt
                          ).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled State */}
        {order.status === "Cancelled" && (
          <div className="mb-8 text-red-600 font-medium">
            This order has been cancelled.
          </div>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDelivery &&
          order.status !== "Cancelled" && (
            <div className="mb-8 text-sm text-gray-600">
              Estimated Delivery:{" "}
              <span className="font-medium">
                {new Date(
                  order.estimatedDelivery
                ).toLocaleDateString("en-IN")}
              </span>
            </div>
          )}

        {/* ITEMS */}
        <div className="space-y-4 mb-8">
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
        <div className="flex justify-between text-lg font-semibold mb-8">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

        {/* Invoice */}
        <div className="mb-8">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/invoice`}
            target="_blank"
            className="inline-block px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Download Invoice
          </a>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 flex-wrap">

          {["Pending", "Confirmed", "Packed"].includes(order.status) && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {actionLoading
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}

          {order.status === "Delivered" &&
            !order.isReturnRequested && (
              <button
                onClick={handleReturn}
                disabled={actionLoading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {actionLoading
                  ? "Requesting..."
                  : "Request Return"}
              </button>
            )}

          {order.isReturnRequested && (
            <span className="text-sm text-gray-600 mt-2">
              Return requested successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";

// type OrderItem = {
//   title: string;
//   price: number;
//   quantity: number;
// };

// type StatusHistoryItem = {
//   status: string;
//   updatedAt: string;
// };

// type Order = {
//   _id: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: string;
//   createdAt: string;
//   estimatedDelivery?: string;
//   isReturnRequested?: boolean;
//   statusHistory?: StatusHistoryItem[];
// };

// const statusStyles: Record<string, string> = {
//   Pending: "bg-yellow-100 text-yellow-700",
//   Confirmed: "bg-blue-100 text-blue-700",
//   Packed: "bg-indigo-100 text-indigo-700",
//   Shipped: "bg-purple-100 text-purple-700",
//   Delivered: "bg-green-100 text-green-700",
//   Cancelled: "bg-red-100 text-red-700",
// };

// export default function OrderDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my`,
//           {
//             credentials: "include",
//             cache: "no-store",
//           }
//         );

//         if (!res.ok) {
//           router.replace("/login?redirect=/account/orders");
//           return;
//         }

//         const orders = await res.json();
//         const found = orders.find((o: Order) => o._id === id);
//         setOrder(found || null);
//       } catch {
//         setOrder(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [id, router]);

//   const handleCancel = async () => {
//     if (!order) return;
//     setActionLoading(true);

//     await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
//       { method: "PUT", credentials: "include" }
//     );

//     router.refresh();
//   };

//   const handleReturn = async () => {
//     if (!order) return;
//     setActionLoading(true);

//     await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/return`,
//       { method: "PUT", credentials: "include" }
//     );

//     router.refresh();
//   };

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 py-20">
//         Loading order details...
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="text-center py-20">
//         <h2 className="text-lg font-semibold mb-3">
//           Order not found
//         </h2>
//         <Link
//           href="/account/orders"
//           className="underline text-black"
//         >
//           Back to Orders
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">

//       {/* Back */}
//       <Link
//         href="/account/orders"
//         className="text-sm text-gray-600 hover:underline"
//       >
//         ← Back to Orders
//       </Link>

//       {/* Card */}
//       <div className="bg-white border rounded-2xl shadow-sm p-8">

//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
//           <div>
//             <p className="text-xs text-gray-500">Order ID</p>
//             <p className="font-semibold text-lg">
//               #{order._id.slice(-6)}
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               {new Date(order.createdAt).toLocaleString("en-IN")}
//             </p>
//           </div>

//           <span
//             className={`px-4 py-2 text-sm font-medium rounded-full h-fit ${
//               statusStyles[order.status] ||
//               "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {order.status}
//           </span>
//         </div>

//         {/* TRACKING */}
//         {order.statusHistory && order.statusHistory.length > 0 && (
//           <div className="mb-10">
//             <h3 className="font-semibold mb-6 text-lg">
//               Order Timeline
//             </h3>

//             <div className="space-y-4">
//               {order.statusHistory.map((item, i) => (
//                 <div key={i} className="flex gap-4">
//                   <div className="w-3 h-3 mt-2 bg-black rounded-full" />
//                   <div>
//                     <p className="font-medium">
//                       {item.status}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(item.updatedAt).toLocaleString("en-IN")}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Estimated Delivery */}
//         {order.estimatedDelivery && (
//           <div className="mb-8 text-sm text-gray-600">
//             Estimated Delivery:{" "}
//             <span className="font-medium">
//               {new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}
//             </span>
//           </div>
//         )}

//         {/* ITEMS */}
//         <div className="space-y-4 mb-8">
//           {order.items.map((item, i) => (
//             <div
//               key={i}
//               className="flex justify-between border-b pb-4"
//             >
//               <div>
//                 <p className="font-medium">
//                   {item.title}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Quantity: {item.quantity}
//                 </p>
//               </div>

//               <p className="font-semibold">
//                 ₹{item.price * item.quantity}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* TOTAL */}
//         <div className="flex justify-between text-lg font-semibold mb-8">
//           <span>Total</span>
//           <span>₹{order.totalAmount}</span>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex gap-4">

//           {["Pending", "Confirmed", "Packed"].includes(order.status) && (
//             <button
//               onClick={handleCancel}
//               disabled={actionLoading}
//               className="px-6 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
//             >
//               {actionLoading ? "Cancelling..." : "Cancel Order"}
//             </button>
//           )}

//           {order.status === "Delivered" && !order.isReturnRequested && (
//             <button
//               onClick={handleReturn}
//               disabled={actionLoading}
//               className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
//             >
//               {actionLoading ? "Requesting..." : "Request Return"}
//             </button>
//           )}

//           {order.isReturnRequested && (
//             <span className="text-sm text-gray-600 mt-2">
//               Return requested
//             </span>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


// // // app/account/orders/[id]/page.tsx
// // "use client";

// // import { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import Link from "next/link";

// // type OrderItem = {
// //   title: string;
// //   price: number;
// //   quantity: number;
// // };

// // type Order = {
// //   _id: string;
// //   items: OrderItem[];
// //   totalAmount: number;
// //   status: string;
// //   createdAt: string;

// //   // 🔥 add these
// //   estimatedDelivery?: string;
// //   isReturnRequested?: boolean;
// //   statusHistory?: {
// //     status: string;
// //     updatedAt: string;
// //   }[];
// // };



// // const orderSteps = ["Pending", "Processing", "Shipped", "Delivered"];

// // export default function OrderDetailPage() {
// //   const { id } = useParams();
// //   const router = useRouter();

// //   const [order, setOrder] = useState<Order | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchOrder = async () => {
// //       try {
// //         const res = await fetch(
// //           `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my`,
// //           {
// //             credentials: "include",
// //             cache: "no-store",
// //           }
// //         );

// //         if (!res.ok) {
// //           router.replace("/login?redirect=/account");
// //           return;
// //         }

// //         const orders = await res.json();
// //         const found = orders.find((o: Order) => o._id === id);
// //         setOrder(found || null);
// //       } catch {
// //         setOrder(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOrder();
// //   }, [id, router]);

// //   if (loading) {
// //     return (
// //       <div className="pt-32 text-center text-gray-500">
// //         Loading order details...
// //       </div>
// //     );
// //   }

// //   if (!order) {
// //     return (
// //       <div className="pt-32 text-center">
// //         <p className="text-lg font-medium mb-4">
// //           Order not found
// //         </p>
// //         <Link href="/account" className="underline text-black">
// //           Back to Orders
// //         </Link>
// //       </div>
// //     );
// //   }

// //   const currentStepIndex = orderSteps.indexOf(order.status);

// //   return (
// //     <main className="bg-gray-100 min-h-screen pt-24">
// //       <div className="max-w-5xl mx-auto px-4 py-12">

// //         <Link
// //           href="/account"
// //           className="text-sm text-gray-600 hover:underline"
// //         >
// //           ← Back to Orders
// //         </Link>

// //         <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6">

// //           {/* HEADER */}
// //           <div className="flex flex-col sm:flex-row justify-between mb-8">
// //             <div>
// //               <p className="text-xs text-gray-500">
// //                 Order ID
// //               </p>
// //               <p className="font-semibold text-lg">
// //                 #{order._id.slice(-6)}
// //               </p>
// //               <p className="text-sm text-gray-500 mt-1">
// //                 {new Date(order.createdAt).toLocaleString("en-IN")}
// //               </p>
// //             </div>

// //             <div className="mt-4 sm:mt-0">
// //               <span className="px-4 py-2 text-sm rounded-full bg-black text-white">
// //                 {order.status}
// //               </span>
// //             </div>
// //           </div>

// //           {/* ================= TRACKING TIMELINE ================= */}
// //           <div className="mb-12">
// //             <h3 className="font-semibold mb-8 text-lg">
// //               Order Progress
// //             </h3>

// //             <div className="relative flex justify-between items-center">

// //               {/* Background Line */}
// //               <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" />

// //               {/* Animated Progress Line */}
// //               <div
// //                 className="absolute top-4 left-0 h-1 bg-green-500 rounded-full transition-all duration-700 ease-in-out"
// //                 style={{
// //                   width: `${(orderSteps.indexOf(order.status) /
// //                     (orderSteps.length - 1)) *
// //                     100
// //                     }%`,
// //                 }}
// //               />

// //               {orderSteps.map((step, index) => {
// //                 const currentIndex = orderSteps.indexOf(order.status);
// //                 const isActive = index <= currentIndex;

// //                 return (
// //                   <div
// //                     key={step}
// //                     className="relative z-10 flex flex-col items-center"
// //                   >
// //                     <div
// //                       className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-500 ${isActive
// //                         ? "bg-green-500 text-white scale-110"
// //                         : "bg-gray-300 text-gray-600"
// //                         }`}
// //                     >
// //                       {index + 1}
// //                     </div>

// //                     <p
// //                       className={`text-xs mt-3 ${isActive ? "text-black font-medium" : "text-gray-500"
// //                         }`}
// //                     >
// //                       {step}
// //                     </p>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {/* Estimated Delivery */}
// //           {order.estimatedDelivery && (
// //             <p className="text-sm text-gray-600 mb-6">
// //               Estimated Delivery:{" "}
// //               <span className="font-medium">
// //                 {new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}
// //               </span>
// //             </p>
// //           )}



// //           {/* ITEMS */}
// //           <div className="space-y-4">
// //             {order.items.map((item, i) => (
// //               <div
// //                 key={i}
// //                 className="flex justify-between border-b pb-4"
// //               >
// //                 <div>
// //                   <p className="font-medium">
// //                     {item.title}
// //                   </p>
// //                   <p className="text-sm text-gray-500">
// //                     Quantity: {item.quantity}
// //                   </p>
// //                 </div>

// //                 <p className="font-semibold">
// //                   ₹{item.price * item.quantity}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>

// //           {/* TOTAL */}
// //           <div className="flex justify-between text-lg font-semibold mt-8">
// //             <span>Total</span>
// //             <span>₹{order.totalAmount}</span>
// //           </div>

// //           {/* ACTION BUTTONS */}
// //           <div className="mt-8 flex gap-4">

// //             {/* Cancel Button */}
// //             {["Pending", "Confirmed", "Packed"].includes(order.status) && (
// //               <button
// //                 onClick={async () => {
// //                   await fetch(
// //                     `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
// //                     { method: "PUT", credentials: "include" }
// //                   );
// //                   location.reload();
// //                 }}
// //                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition"
// //               >
// //                 Cancel Order
// //               </button>
// //             )}

// //             {/* Return Button */}
// //             {order.status === "Delivered" && !order.isReturnRequested && (
// //               <button
// //                 onClick={async () => {
// //                   await fetch(
// //                     `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/return`,
// //                     { method: "PUT", credentials: "include" }
// //                   );
// //                   location.reload();
// //                 }}
// //                 className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
// //               >
// //                 Request Return
// //               </button>
// //             )}

// //           </div>


// //         </div>
// //       </div>
// //     </main>
// //   );
// // }