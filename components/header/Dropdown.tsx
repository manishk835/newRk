"use client";

import Link from "next/link";
import { NavChild } from "./navData";

type Props = {
  parentSlug: string;
  items: NavChild[];
};

export default function Dropdown({ parentSlug, items }: Props) {
  return (
    <div className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-white shadow-lg border py-2">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/${parentSlug}/${item.slug}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
