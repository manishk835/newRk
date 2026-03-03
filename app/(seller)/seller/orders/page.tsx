async function getOrders() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/seller/orders`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to load orders");

  return res.json();
}

export default async function SellerOrders() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <p className="font-semibold">Order #{order._id}</p>
            <p>Status: {order.status}</p>
            <p>Payment: {order.paymentStatus}</p>
            <p className="font-bold mt-2">
              Earning: ₹{order.sellerTotal}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// // app/(seller)/seller/orders/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { apiFetch } from "@/lib/api/client";

// export default function SellerOrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       const data = await apiFetch("/seller/orders");
//       setOrders(data || []);
//       setLoading(false);
//     };

//     load();
//   }, []);

//   if (loading) return <div>Loading orders...</div>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">
//         My Orders
//       </h1>

//       {orders.length === 0 ? (
//         <p>No orders yet.</p>
//       ) : (
//         <div className="bg-white border rounded-2xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-4 text-left">Order ID</th>
//                 <th className="px-6 py-4 text-center">Total</th>
//                 <th className="px-6 py-4 text-center">Status</th>
//                 <th className="px-6 py-4 text-center">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map(order => (
//                 <tr key={order._id} className="border-t">
//                   <td className="px-6 py-4">{order._id}</td>
//                   <td className="px-6 py-4 text-center">₹{order.totalAmount}</td>
//                   <td className="px-6 py-4 text-center">
//                     <span
//                       className={`px-3 py-1 text-xs rounded-full ${order.status === "delivered"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-gray-100 text-gray-600"
//                         }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>                  <td className="px-6 py-4 text-center">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }