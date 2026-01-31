"use client";

import { useEffect, useState } from "react";
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

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    if (!phone) return;

    const fetchOrders = async () => {
      const res = await fetch(
        `http://localhost:5000/api/orders/my?phone=${phone}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="bg-white border rounded-2xl p-10 text-center">
        <p className="text-lg font-medium mb-2">No orders yet</p>
        <Link href="/products" className="bg-black text-white px-6 py-3 rounded-xl inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white border rounded-2xl p-6">
          <p className="font-medium">#{order._id.slice(-6)}</p>
          <p>Total: ₹{order.totalAmount}</p>

          <Link
            href={`/account/orders/${order._id}`}
            className="inline-block mt-3 border px-4 py-2 rounded-lg text-sm"
          >
            View Order
          </Link>
        </div>
      ))}
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";

// type User = {
//   name: string;
//   phone: string;
// };

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

// export default function AccountPage() {
//   const pathname = usePathname();

//   const isActive = (path: string) =>
//     pathname === path || pathname.startsWith(path + "/");

//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     const storedUser = localStorage.getItem("rk_user");
//     const phone = localStorage.getItem("userPhone");

//     if (!storedUser || !phone) {
//       router.push("/login");
//       return;
//     }

//     const parsedUser = JSON.parse(storedUser);

//     // 🔥 FORCE same phone as orders page
//     setUser({
//       name: parsedUser.name,
//       phone: phone,
//     });
//   }, [router]);

//   /* ================= FETCH ORDERS ================= */
//   useEffect(() => {
//     if (!user) return;

//     const fetchOrders = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/orders/my?phone=${user.phone}`,
//           { cache: "no-store" }
//         );

//         if (!res.ok) {
//           setOrders([]);
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
//   }, [user]);

//   /* ================= LOGOUT ================= */
//   const logout = () => {
//     localStorage.removeItem("rk_user");
//     localStorage.removeItem("userPhone");
//     router.push("/login");
//   };

//   if (!user) return null;


//   return (
//     <main className="pt-24 bg-[#FAFAFA] min-h-screen">
//       <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">

//         {/* ================= SIDEBAR ================= */}
//         <aside className="lg:col-span-1 bg-white border rounded-2xl p-6 h-fit">
//           <p className="text-sm text-gray-500 mb-1">
//             Welcome,
//           </p>
//           <p className="text-lg font-semibold mb-6">
//             {user.name}
//           </p>
//           <nav className="space-y-2 text-sm">
//             <Link
//               href="/account"
//               className={`block px-4 py-3 rounded-lg transition ${
//                 isActive("/account")
//                   ? "bg-[#FAFAFA] font-medium text-black"
//                   : "text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               📦 Orders
//             </Link>

//             <div className="px-4 py-3 text-gray-400 cursor-not-allowed">
//               ❤️ Favorites
//             </div>

//             <div className="px-4 py-3 text-gray-400 cursor-not-allowed">
//               👤 Personal Data
//             </div>

//             <div className="px-4 py-3 text-gray-400 cursor-not-allowed">
//               🔒 Change Password
//             </div>

//             <div className="px-4 py-3 text-gray-400 cursor-not-allowed">
//               🏠 Addresses
//             </div>

//             <button
//               onClick={logout}
//               className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-4"
//             >
//               🚪 Sign Out
//             </button>
//           </nav>

//         </aside>

//         {/* ================= MAIN ================= */}
//         <section className="lg:col-span-3">
//           <h1 className="text-2xl font-bold mb-6">
//             Orders
//           </h1>

//           {loading ? (
//             <p className="text-gray-600">
//               Loading orders...
//             </p>
//           ) : orders.length === 0 ? (
//             <div className="bg-white border rounded-2xl p-10 text-center">
//               <p className="text-lg font-medium mb-2">
//                 No orders yet
//               </p>
//               <p className="text-gray-500 mb-6">
//                 Once you place an order, it will appear here.
//               </p>
//               <Link
//                 href="/products"
//                 className="inline-block bg-black text-white px-6 py-3 rounded-xl"
//               >
//                 Start Shopping
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {orders.map((order) => (
//                 <div
//                   key={order._id}
//                   className="bg-white border rounded-2xl p-6"
//                 >
//                   {/* HEADER */}
//                   <div className="flex justify-between items-center mb-4">
//                     <div>
//                       <p className="text-sm text-gray-500">
//                         Order number
//                       </p>
//                       <p className="font-medium">
//                         #{order._id.slice(-6)}
//                       </p>
//                     </div>

//                     <span
//                       className={`text-sm font-medium px-3 py-1 rounded-full ${
//                         order.status === "Delivered"
//                           ? "bg-green-100 text-green-700"
//                           : order.status === "Cancelled"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </div>

//                   {/* ITEMS */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
//                     {order.items.slice(0, 3).map((item, i) => (
//                       <div
//                         key={i}
//                         className="border rounded-lg p-3"
//                       >
//                         <p className="font-medium line-clamp-1">
//                           {item.title}
//                         </p>
//                         <p className="text-gray-500">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                     ))}
//                   </div>

//                   {/* FOOTER */}
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-500">
//                         Total
//                       </p>
//                       <p className="font-semibold">
//                         ₹{order.totalAmount}
//                       </p>
//                     </div>

//                     <Link
//                       href={`/account/orders/${order._id}`}
//                       className="border px-5 py-2 rounded-lg text-sm hover:bg-gray-50 inline-block"
//                     >
//                       View Order
//                     </Link>

//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }
