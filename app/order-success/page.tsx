"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-20 text-center">
      <div className="max-w-xl mx-auto">
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-3xl font-bold mb-3 text-[#111111]">
          Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for shopping with RK Fashion House.  
          Your order has been received and will be delivered soon.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/orders"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          📦 Cash on Delivery • 🚚 Fast Delivery • 🧵 Premium Quality
        </p>
      </div>
    </div>
  );
}
