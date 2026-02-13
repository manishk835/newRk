"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

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
          router.replace("/login?redirect=/orders");
          return;
        }

        const orders = await res.json();
        const found = orders.find((o: Order) => o._id === id);

        if (!found) {
          setOrder(null);
        } else {
          setOrder(found);
        }
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
      <div className="pt-28 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-28 text-center">
        <h2 className="text-xl font-semibold mb-3">
          Order not found
        </h2>
      </div>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Order #{order._id.slice(-6)}
            </h1>
            <span className="px-4 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700 font-medium">
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="space-y-3 mb-6">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-semibold mb-8">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          {/* DELIVERY */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="font-semibold mb-2">
              Delivery Address
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.customer.name} <br />
              {order.customer.address} <br />
              {order.customer.city} – {order.customer.pincode} <br />
              📞 {order.customer.phone}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}


// // app/orders/page.tsx


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// type OrderItem = {
//   productId: string;
//   title: string;
//   price: number;
//   quantity: number;
// };

// type Order = {
//   _id: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
//   createdAt: string;
// };

// const statusStyles: Record<Order["status"], string> = {
//   Pending: "bg-yellow-100 text-yellow-700",
//   Processing: "bg-blue-100 text-blue-700",
//   Shipped: "bg-purple-100 text-purple-700",
//   Delivered: "bg-green-100 text-green-700",
//   Cancelled: "bg-red-100 text-red-700",
// };

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const phone = localStorage.getItem("userPhone");

//         if (!phone) {
//           setOrders([]);
//           setLoading(false);
//           return;
//         }

//         const res = await fetch(
//           `http://localhost:5000/api/orders/my?phone=${phone}`,
//           { cache: "no-store" }
//         );

//         const data = await res.json();
//         setOrders(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Orders fetch error", err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="container mx-auto px-6 pt-28 text-center">
//         <p className="text-gray-600">Loading your orders...</p>
//       </div>
//     );
//   }

//   /* ================= EMPTY ================= */
//   if (orders.length === 0) {
//     return (
//       <div className="container mx-auto px-6 pt-28 text-center">
//         <h1 className="text-2xl font-bold mb-2">
//           No orders yet
//         </h1>
//         <p className="text-gray-600 mb-6">
//           You haven&apos;t placed any orders yet.
//         </p>
//         <Link
//           href="/products"
//           className="inline-block px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
//         >
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <main className="pt-24">
//       <div className="container mx-auto px-6 py-16 max-w-4xl">
//         <h1 className="text-3xl font-bold mb-10">
//           My Orders
//         </h1>

//         <div className="space-y-6">
//           {orders.map((order) => (
//             <Link
//               key={order._id}
//               href={`/orders/${order._id}`}
//               className="block border rounded-2xl p-6 hover:shadow-md transition"
//             >
//               {/* HEADER */}
//               <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
//                 <div>
//                   <p className="text-xs text-gray-500">
//                     Order ID
//                   </p>
//                   <p className="font-semibold">
//                     #{order._id.slice(-6)}
//                   </p>
//                 </div>

//                 <div className="text-sm text-gray-500">
//                   {new Date(order.createdAt).toLocaleDateString("en-IN", {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </div>
//               </div>

//               {/* ITEMS PREVIEW */}
//               <div className="space-y-1 text-sm text-gray-700 mb-4">
//                 {order.items.slice(0, 2).map((item) => (
//                   <div
//                     key={item.productId}
//                     className="flex justify-between"
//                   >
//                     <span>
//                       {item.title} × {item.quantity}
//                     </span>
//                     <span>
//                       ₹{item.price * item.quantity}
//                     </span>
//                   </div>
//                 ))}

//                 {order.items.length > 2 && (
//                   <p className="text-xs text-gray-500">
//                     +{order.items.length - 2} more items
//                   </p>
//                 )}
//               </div>

//               {/* FOOTER */}
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                 <div className="font-semibold">
//                   Total: ₹{order.totalAmount}
//                 </div>

//                 <span
//                   className={`text-sm font-medium px-3 py-1 rounded-full ${statusStyles[order.status]}`}
//                 >
//                   {order.status}
//                 </span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }

