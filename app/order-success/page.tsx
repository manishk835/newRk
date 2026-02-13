"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-gray-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-10">

          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-600 w-20 h-20 flex items-center justify-center rounded-full text-4xl">
              ✓
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Order Confirmed 🎉
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Thank you for shopping with <span className="font-semibold">RK Fashion House</span>.
            Your order has been placed successfully.
          </p>

          {/* ORDER DETAILS */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm">

            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium text-gray-900">
                  #{orderId.slice(-8).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-900">
                Cash on Delivery / Online Payment
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Delivery</span>
              <span className="font-medium text-gray-900">
                3 – 5 Business Days
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium text-green-600">
                Free
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

            <Link
              href="/orders"
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold text-center hover:bg-gray-800 transition"
            >
              View My Orders
            </Link>

            <Link
              href="/"
              className="px-8 py-4 border border-gray-300 rounded-xl font-semibold text-center hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>

          </div>

          {/* TRUST SECTION */}
          <div className="mt-12 border-t pt-8 grid sm:grid-cols-3 gap-6 text-center text-sm text-gray-600">

            <div>
              <div className="text-xl mb-2">🚚</div>
              <p className="font-medium text-gray-900">Fast Delivery</p>
              <p>Quick & secure shipping</p>
            </div>

            <div>
              <div className="text-xl mb-2">🔒</div>
              <p className="font-medium text-gray-900">Secure Payments</p>
              <p>100% safe transactions</p>
            </div>

            <div>
              <div className="text-xl mb-2">📞</div>
              <p className="font-medium text-gray-900">Customer Support</p>
              <p>We’re here to help you</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
