"use client";

import Link from "next/link";
import { NavChild } from "./navData";

type Props = {
  parentSlug: string;
  items: NavChild[];
};

export default function Dropdown({ parentSlug, items }: Props) {
  return (
    <div
      className="
        absolute left-0 top-full mt-1 w-60
        rounded-xl bg-white
        border border-gray-200
        shadow-xl
        py-3
        z-50
        animate-dropdown
      "
    >
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/category/${parentSlug}?type=${item.slug}`}
          className="
            group flex items-center justify-between
            px-5 py-2.5
            text-sm font-medium text-gray-700
            hover:bg-[#FAFAFA]
            transition
          "
        >
          <span className="group-hover:text-black">
            {item.label}
          </span>

          {/* subtle arrow on hover */}
          <span className="text-gray-300 group-hover:text-[#F5A623] transition">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
