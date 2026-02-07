// components/header/CategoryDropdown.tsx

"use client";

import Link from "next/link";
import { Category } from "./types";

type Props = {
  parentSlug: string;
  items: Category[];
};

export default function CategoryDropdown({
  parentSlug,
  items,
}: Props) {
  return (
    <div className="absolute left-0 top-full mt-3 min-w-50
      bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
      {items.map((item) => (
        <Link
          key={item._id}
          href={`/category/${parentSlug}?type=${item.slug}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
