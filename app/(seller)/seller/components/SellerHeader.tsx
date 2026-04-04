"use client";

import { Menu } from "lucide-react";
import useSellerAuth from "../hooks/useSellerAuth";

export default function SellerHeader() {
  const { user } = useSellerAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Menu size={20} className="lg:hidden cursor-pointer" />
        <span className="text-sm text-gray-600">
          Seller Panel
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <button className="text-sm bg-black text-white px-4 py-2 rounded-lg">
          + Add Product
        </button>

        <div className="text-sm text-gray-700">
          👋 {user?.name || "Seller"}
        </div>
      </div>
    </header>
  );
}