"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${id}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 pt-28">
        Order not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-16 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        Order #{order._id.slice(-6)}
      </h1>

      {/* STATUS */}
      <p className="mb-4 text-sm">
        Status:{" "}
        <span className="font-medium text-green-600">
          {order.status}
        </span>
      </p>

      {/* ITEMS */}
      <div className="border rounded-xl p-5 mb-6">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-sm mb-2"
          >
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* DELIVERY */}
      <div className="border rounded-xl p-5">
        <h2 className="font-semibold mb-2">
          Delivery Address
        </h2>
        <p className="text-sm text-gray-700">
          {order.customer.name}<br />
          {order.customer.address}<br />
          {order.customer.city} – {order.customer.pincode}<br />
          📞 {order.customer.phone}
        </p>
      </div>
    </div>
  );
}
