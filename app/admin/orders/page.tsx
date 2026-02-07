"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "@/lib/adminApi";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  customer?: {
    name?: string;
    phone?: string;
  };
  items?: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const handleStatusUpdate = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Orders</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600"
        >
          Logout
        </button>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4"
            >
              {/* TOP ROW */}
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Order #{order._id}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              {/* CUSTOMER */}
              <p className="text-sm mb-2">
                Customer:{" "}
                <b>{order.customer?.name || "N/A"}</b>{" "}
                — {order.customer?.phone || "N/A"}
              </p>

              {/* ITEMS */}
              <div className="text-sm mb-3 space-y-1">
                {order.items?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Total: ₹{order.totalAmount}
                </span>

                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) =>
                    handleStatusUpdate(
                      order._id,
                      e.target.value
                    )
                  }
                  className="border px-3 py-1 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// // app/admin/orders/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const router = useRouter();
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("adminToken")
//       : null;

//   useEffect(() => {
//     if (!token) {
//       router.push("/admin/login");
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.status === 401) {
//           localStorage.removeItem("adminToken");
//           router.push("/admin/login");
//           return;
//         }

//         const data = await res.json();
//         setOrders(data);
//       } catch (err) {
//         alert("Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [router, token]);

//   const updateStatus = async (id: string, status: string) => {
//     await fetch(`http://localhost:5000/api/orders/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ status }),
//     });

//     setOrders((prev) =>
//       prev.map((o) =>
//         o._id === id ? { ...o, status } : o
//       )
//     );
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     router.push("/admin/login");
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 pt-28">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-12">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Admin Orders</h1>
//         <button
//           onClick={handleLogout}
//           className="text-sm text-red-600"
//         >
//           Logout
//         </button>
//       </div>

//       {orders.length === 0 ? (
//         <p>No orders found</p>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="border rounded-lg p-4"
//             >
//               <div className="flex justify-between mb-2">
//                 <span className="font-medium">
//                   Order #{order._id}
//                 </span>
//                 <span className="text-sm text-gray-600">
//                   {new Date(order.createdAt).toLocaleString()}
//                 </span>
//               </div>

//               <p className="text-sm mb-2">
//                 Customer: <b>{order.customer.name}</b> —{" "}
//                 {order.customer.phone}
//               </p>

//               <div className="text-sm mb-3">
//                 {order.items.map((item: any) => (
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
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="font-semibold">
//                   Total: ₹{order.totalAmount}
//                 </span>

//                 <select
//                   value={order.status}
//                   onChange={(e) =>
//                     updateStatus(order._id, e.target.value)
//                   }
//                   className="border px-3 py-1 rounded"
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="Delivered">Delivered</option>
//                 </select>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
