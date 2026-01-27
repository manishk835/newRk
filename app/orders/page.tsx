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
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 👇 user phone (jo checkout ke time use hua)
        const phone = localStorage.getItem("userPhone");
  
        if (!phone) {
          setOrders([]);
          setLoading(false);
          return;
        }
  
        const res = await fetch(
          `http://localhost:5000/api/orders/my?phone=${phone}`,
          { cache: "no-store" }
        );
  
        const data = await res.json();
  
        // ✅ Backend always returns ARRAY
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 pt-28 text-center">
        <h1 className="text-2xl font-bold mb-2">
          No orders yet
        </h1>
        <p className="text-gray-600">
          Start shopping and your orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">
                Order #{order._id.slice(-6)}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
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

              <span
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
