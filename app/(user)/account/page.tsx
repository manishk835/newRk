"use client";

import { useEffect, useState } from "react";

type Stats = {
  orders: number;
  delivered: number;
  cancelled: number;
  spent: number;
  loyaltyPoints: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    delivered: 0,
    cancelled: 0,
    spent: 0,
    loyaltyPoints: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch(`${BASE_URL}/api/orders/my`, {
          credentials: "include",
        });

        const userRes = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        const orders = await ordersRes.json();
        const user = userRes.ok ? await userRes.json() : null;

        const delivered = orders.filter((o: any) => o.status === "Delivered").length;
        const cancelled = orders.filter((o: any) => o.status === "Cancelled").length;

        const spent = orders.reduce(
          (sum: number, o: any) => sum + o.totalAmount,
          0
        );

        setStats({
          orders: orders.length,
          delivered,
          cancelled,
          spent,
          loyaltyPoints: user?.loyaltyPoints || 0,
        });

        setRecentOrders(orders.slice(0, 3)); // latest 3 orders
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  if (loading) return null;

  return (
    <div className="space-y-8">

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.orders} icon="📦" />
        <StatCard title="Delivered" value={stats.delivered} icon="✅" />
        <StatCard title="Cancelled" value={stats.cancelled} icon="❌" />
        <StatCard title="Total Spent" value={`₹${stats.spent}`} icon="💳" />
      </div>

      {/* ================= LOYALTY ================= */}
      <div className="rounded-2xl p-6 bg-linear-to-r from-indigo-900 to-purple-900 text-white flex justify-between items-center shadow-md">
        <div>
          <h2 className="font-semibold text-lg">Loyalty Points</h2>
          <p className="text-sm text-gray-200">
            Earn points on every delivered order
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold">{stats.loyaltyPoints}</p>
          <p className="text-xs opacity-70">Points</p>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3">
          QUICK ACTIONS
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <AccountCard title="Your Orders" desc="Track & manage orders" icon="📦" />
          <AccountCard title="Addresses" desc="Manage delivery address" icon="📍" />
          <AccountCard title="Payments" desc="Cards & UPI settings" icon="💳" />
          <AccountCard title="Wallet" desc="Add or use balance" icon="💰" />
          <AccountCard title="Security" desc="Password & login settings" icon="🔐" />
          <AccountCard title="Support" desc="Get help & contact us" icon="🎧" />
        </div>
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 mb-3">
          RECENT ORDERS
        </h2>

        <div className="bg-white rounded-2xl border divide-y">
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">
              No recent orders found.
            </p>
          ) : (
            recentOrders.map((order, i) => (
              <div key={i} className="p-4 flex justify-between items-center">

                <div>
                  <p className="text-sm font-medium">
                    Order #{order._id?.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.status}
                  </p>
                </div>

                <div className="text-sm font-semibold">
                  ₹{order.totalAmount}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition">

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-xl font-semibold mt-1">{value}</h2>
      </div>

      <div className="text-2xl">{icon}</div>
    </div>
  );
}

/* ================= ACCOUNT CARD ================= */

function AccountCard({ title, desc, icon }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 flex justify-between items-center hover:shadow-md hover:scale-[1.02] transition cursor-pointer">

      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>

        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{desc}</p>
        </div>
      </div>

      <div className="text-gray-400">›</div>
    </div>
  );
}