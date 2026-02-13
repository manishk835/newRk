"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Order = {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
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

        const data = await res.json();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-28 text-center">
        <h1 className="text-2xl font-bold mb-3">
          No orders yet
        </h1>
        <p className="text-gray-500 mb-6">
          Start shopping to place your first order.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white rounded-xl font-semibold"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-10">
          My Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Order ID
                  </p>
                  <p className="font-semibold">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  ₹{order.totalAmount}
                </span>

                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

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
//   status: string;
//   createdAt: string;
// };

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my`,
//           {
//             credentials: "include",
//             cache: "no-store",
//           }
//         );

//         if (!res.ok) {
//           router.push("/login");
//           return;
//         }

//         const data = await res.json();
//         setOrders(Array.isArray(data) ? data : []);
//       } catch {
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="pt-28 text-center">
//         Loading your orders...
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="pt-28 text-center">
//         <h1 className="text-2xl font-bold mb-4">
//           No orders yet
//         </h1>
//         <Link
//           href="/products"
//           className="px-6 py-3 bg-black text-white rounded-lg"
//         >
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <main className="pt-24">
//       <div className="max-w-4xl mx-auto px-4 py-16">
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
//               <div className="flex justify-between mb-4">
//                 <div>
//                   <p className="text-xs text-gray-500">
//                     Order ID
//                   </p>
//                   <p className="font-semibold">
//                     #{order._id.slice(-6)}
//                   </p>
//                 </div>

//                 <div className="text-sm text-gray-500">
//                   {new Date(order.createdAt).toLocaleDateString("en-IN")}
//                 </div>
//               </div>

//               <div className="font-semibold">
//                 Total: ₹{order.totalAmount}
//               </div>

//               <div className="mt-2 text-sm text-gray-600">
//                 Status: {order.status}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }

