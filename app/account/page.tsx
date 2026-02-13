"use client";

import Link from "next/link";

export default function AccountDashboard() {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      <Link
        href="/account/orders"
        className="border rounded-2xl p-6 hover:shadow-md transition"
      >
        <div className="text-3xl mb-3">📦</div>
        <h2 className="font-semibold mb-1">My Orders</h2>
        <p className="text-sm text-gray-500">
          Track, return or buy again
        </p>
      </Link>

      <Link
        href="/account/favorites"
        className="border rounded-2xl p-6 hover:shadow-md transition"
      >
        <div className="text-3xl mb-3">❤️</div>
        <h2 className="font-semibold mb-1">Wishlist</h2>
        <p className="text-sm text-gray-500">
          View your saved products
        </p>
      </Link>

      <Link
        href="/account/addresses"
        className="border rounded-2xl p-6 hover:shadow-md transition"
      >
        <div className="text-3xl mb-3">🏠</div>
        <h2 className="font-semibold mb-1">Saved Addresses</h2>
        <p className="text-sm text-gray-500">
          Manage delivery addresses
        </p>
      </Link>

    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// type Order = {
//   _id: string;
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// };

// const statusStyles: Record<string, string> = {
//   Pending: "bg-yellow-100 text-yellow-700",
//   Processing: "bg-blue-100 text-blue-700",
//   Shipped: "bg-purple-100 text-purple-700",
//   Delivered: "bg-green-100 text-green-700",
//   Cancelled: "bg-red-100 text-red-700",
// };

// export default function AccountOrdersPage() {
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

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
//           router.replace("/login?redirect=/account");
//           return;
//         }

//         const data = await res.json();
//         setOrders(data);
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
//       <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
//         Loading your orders...
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl shadow-md p-12 text-center">
//         <h2 className="text-xl font-semibold mb-3">
//           No orders yet
//         </h2>
//         <p className="text-gray-500 mb-6">
//           Looks like you haven't placed any order.
//         </p>
//         <Link
//           href="/"
//           className="px-6 py-3 bg-black text-white rounded-xl font-semibold"
//         >
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">
//         My Orders
//       </h1>

//       <div className="space-y-6">
//         {orders.map((order) => (
//           <Link
//             key={order._id}
//             href={`/orders/${order._id}`}
//             className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <p className="text-xs text-gray-500">
//                   Order ID
//                 </p>
//                 <p className="font-semibold">
//                   #{order._id.slice(-6)}
//                 </p>
//               </div>

//               <div className="text-sm text-gray-500">
//                 {new Date(order.createdAt).toLocaleDateString(
//                   "en-IN"
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold">
//                 ₹{order.totalAmount}
//               </span>

//               <span
//                 className={`px-4 py-1 text-xs rounded-full font-medium ${
//                   statusStyles[order.status] ||
//                   "bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 {order.status}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

