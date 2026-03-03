// app/(seller)/seller/layout.tsx

import Link from "next/link";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Seller Panel</h2>

        <nav className="space-y-3">
          <Link href="/seller">Dashboard</Link>
          <Link href="/seller/products">Manage Products</Link>
          <Link href="/seller/products/create">Add Product</Link>
          <Link href="/seller/orders">Orders</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}