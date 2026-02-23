"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Product = {
  _id: string;
  isApproved: boolean;
};

type Order = {
  totalAmount: number;
  items: {
    sellerEarning: number;
  }[];
};

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, orderData] = await Promise.all([
          apiFetch("/seller/products"),
          apiFetch("/seller/orders"),
        ]);

        setProducts(productData || []);
        setOrders(orderData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const totalProducts = products.length;
  const approvedProducts = products.filter(p => p.isApproved).length;
  const pendingProducts = totalProducts - approvedProducts;

  const totalEarnings = orders.reduce((sum, order) => {
    return sum + order.items.reduce(
      (s, i) => s + (i.sellerEarning || 0),
      0
    );
  }, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard title="Approved Products" value={approvedProducts} />
        <StatCard title="Pending Products" value={pendingProducts} />
        <StatCard title="Total Earnings" value={`₹${totalEarnings}`} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}