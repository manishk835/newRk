"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="pt-24">
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          {/* ICON */}
          <div className="text-6xl mb-6">🎉</div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-[#111111] mb-4">
            Order Placed Successfully
          </h1>

          {/* MESSAGE */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for shopping with <b>RK Fashion House</b>.
            Your order has been received and is now being processed.
            You will receive your order very soon.
          </p>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/orders"
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              View My Orders
            </Link>

            <Link
              href="/"
              className="px-8 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>

          {/* TRUST INFO */}
          <div className="mt-10 text-sm text-gray-500 space-y-1">
            <p>📦 Cash on Delivery available</p>
            <p>🚚 Fast & reliable delivery</p>
            <p>🧵 Premium quality products</p>
            <p>📞 Support available for any assistance</p>
          </div>
        </div>
      </div>
    </main>
  );
}
