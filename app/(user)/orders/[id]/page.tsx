// // app/orders/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/my`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          router.replace("/login?redirect=/orders");
          return;
        }

        const orders = await res.json();
        const found = orders.find((o: Order) => o._id === id);

        if (!found) {
          setOrder(null);
        } else {
          setOrder(found);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-28 text-center">
        <h2 className="text-xl font-semibold mb-3">
          Order not found
        </h2>
      </div>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Order #{order?._id?.slice(-6)}
            </h1>
            <span className="px-4 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700 font-medium">
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="space-y-3 mb-6">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-semibold mb-8">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          {/* DELIVERY */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="font-semibold mb-2">
              Delivery Address
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.customer.name} <br />
              {order.customer.address} <br />
              {order.customer.city} – {order.customer.pincode} <br />
              📞 {order.customer.phone}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}