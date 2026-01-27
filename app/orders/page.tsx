"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  productId: string;
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
  customer: {
    phone: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem("lastOrderPhone"); // 👈 see below

    if (!phone) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/my?phone=${phone}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-28">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">
                Order #{order._id}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="text-sm mb-3 space-y-1">
              {order.items.map((item) => (
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

            <div className="flex justify-between items-center">
              <span className="font-semibold">
                Total: ₹{order.totalAmount}
              </span>

              <span className="text-sm font-medium">
                Status: {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";

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

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/orders", {
//           cache: "no-store",
//         });

//         const data = await res.json();

//         /**
//          * ✅ SAFETY CHECK
//          * Backend agar { orders: [] } bheje
//          * ya directly [] bheje – dono handle honge
//          */
//         if (Array.isArray(data)) {
//           setOrders(data);
//         } else if (Array.isArray(data.orders)) {
//           setOrders(data.orders);
//         } else {
//           setOrders([]);
//         }
//       } catch (err) {
//         console.error("Failed to fetch orders", err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 pt-28">
//         Loading orders...
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="container mx-auto px-4 pt-28">
//         <h1 className="text-2xl font-bold mb-4">My Orders</h1>
//         <p>No orders found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-12">
//       <h1 className="text-2xl font-bold mb-6">My Orders</h1>

//       <div className="space-y-6">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="border rounded-lg p-4"
//           >
//             <div className="flex justify-between mb-2">
//               <span className="font-medium">
//                 Order #{order._id}
//               </span>
//               <span className="text-sm text-gray-600">
//                 {new Date(order.createdAt).toLocaleString()}
//               </span>
//             </div>

//             <div className="text-sm mb-3 space-y-1">
//               {order.items.map((item) => (
//                 <div
//                   key={item.productId}
//                   className="flex justify-between"
//                 >
//                   <span>
//                     {item.title} × {item.quantity}
//                   </span>
//                   <span>
//                     ₹{item.price * item.quantity}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="font-semibold">
//                 Total: ₹{order.totalAmount}
//               </span>

//               <span className="text-sm font-medium">
//                 Status: {order.status}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// // "use client";

// // import { useEffect, useState } from "react";

// // export default function OrdersPage() {
// //   const [orders, setOrders] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       const res = await fetch(
// //         "http://localhost:5000/api/orders"
// //       );
// //       const data = await res.json();
// //       setOrders(data);
// //       setLoading(false);
// //     };

// //     fetchOrders();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="container mx-auto px-4 pt-28">
// //         Loading orders...
// //       </div>
// //     );
// //   }

// //   if (orders.length === 0) {
// //     return (
// //       <div className="container mx-auto px-4 pt-28 text-center">
// //         <h1 className="text-2xl font-bold">
// //           No orders yet
// //         </h1>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 pt-28 pb-12">
// //       <h1 className="text-2xl font-bold mb-6">
// //         My Orders
// //       </h1>

// //       <div className="space-y-6">
// //         {orders.map((order) => (
// //           <div
// //             key={order._id}
// //             className="border rounded-lg p-4"
// //           >
// //             <div className="flex justify-between mb-2">
// //               <span className="font-medium">
// //                 Order #{order._id}
// //               </span>
// //               <span className="text-sm text-gray-600">
// //                 {new Date(order.createdAt).toLocaleDateString()}
// //               </span>
// //             </div>

// //             <p className="text-sm mb-2">
// //               Status:{" "}
// //               <b>{order.status}</b>
// //             </p>

// //             {order.items.map((item: any) => (
// //               <div
// //                 key={item.productId}
// //                 className="flex justify-between text-sm"
// //               >
// //                 <span>
// //                   {item.title} × {item.quantity}
// //                 </span>
// //                 <span>
// //                   ₹{item.price * item.quantity}
// //                 </span>
// //               </div>
// //             ))}

// //             <div className="mt-3 font-semibold">
// //               Total: ₹{order.totalAmount}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
