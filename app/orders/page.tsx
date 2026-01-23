"use client";

export default function OrdersPage() {
  const orders = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("orders") || "[]"
      : "[]"
  );

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-28 text-center">
        <h1 className="text-2xl font-bold">
          No orders yet
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium">
                Order #{order.id}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm mb-2">
              Status:{" "}
              <span className="font-semibold">
                {order.status}
              </span>
            </p>

            <div className="text-sm text-gray-700">
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

            <div className="mt-3 font-semibold">
              Total: ₹{order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
