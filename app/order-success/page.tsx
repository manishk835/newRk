"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 pt-28 text-center">
      <h1 className="text-3xl font-bold mb-4">
        🎉 Order Placed Successfully
      </h1>

      <p className="text-gray-600 mb-6">
        Thank you for shopping with us. Your order will be delivered
        soon.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/orders"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          View My Orders
        </Link>

        <Link
          href="/"
          className="border px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
