"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
      return;
    }
  
    const fetchOrders = async () => {
      const res = await fetch(
        "http://localhost:5000/api/orders"
      );
      const data = await res.json();
      setOrders(data);
    };
  
    fetchOrders();
  }, [router]);
  

  const updateStatus = async (id: string, status: string) => {
    await fetch(
      `http://localhost:5000/api/orders/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
  
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status } : o
      )
    );
  };
  

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-28">
        <h1 className="text-2xl font-bold">
          No Orders Found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">
        Admin — Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium">
                Order #{order.id}
              </span>
              <span className="text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-sm mb-2">
              Customer:{" "}
              <b>{order.customer.name}</b> —{" "}
              {order.customer.phone}
            </p>

            <p className="text-sm mb-2">
              Address: {order.customer.address},{" "}
              {order.customer.city} -{" "}
              {order.customer.pincode}
            </p>

            <div className="text-sm mb-3">
              {order.items.map((item: any) => (
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

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
                className="border px-3 py-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
