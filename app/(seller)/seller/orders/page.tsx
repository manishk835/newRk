"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type OrderItem = {
  title: string;
  quantity: number;
  sellerEarning: number;
};

type Customer = {
  name: string;
  phone: string;
  city?: string;
};

type Order = {
  _id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  sellerTotal: number;
  customer: Customer;
  items: OrderItem[];
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDERS ================= */

  const loadOrders = async () => {
    try {
      const data = await apiFetch("/seller/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Order load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Confirmed":
        return "bg-indigo-100 text-indigo-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Store Orders
      </h1>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">

            <tr>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Items
              </th>

              <th className="p-4 text-left">
                Earnings
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order._id}
                className="border-t hover:bg-gray-50"
              >

                {/* CUSTOMER */}

                <td className="p-4">

                  <div className="font-medium">
                    {order.customer?.name}
                  </div>

                  <div className="text-gray-500 text-xs">
                    {order.customer?.phone}
                  </div>

                  {order.customer?.city && (
                    <div className="text-gray-400 text-xs">
                      {order.customer.city}
                    </div>
                  )}

                </td>

                {/* ITEMS */}

                <td className="p-4 space-y-1">

                  {order.items.map((item, i) => (

                    <div key={i} className="text-sm">

                      {item.title}

                      <span className="text-gray-500">
                        {" "}× {item.quantity}
                      </span>

                    </div>

                  ))}

                </td>

                {/* EARNINGS */}

                <td className="p-4 font-semibold text-green-600">
                  ₹{order.sellerTotal}
                </td>

                {/* STATUS */}

                <td className="p-4">

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </td>

                {/* DATE */}

                <td className="p-4 text-gray-500 text-xs">

                  {new Date(
                    order.createdAt
                  ).toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No orders yet
          </div>
        )}

      </div>

    </div>
  );
}