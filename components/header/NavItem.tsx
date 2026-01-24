"use client";

import { useState } from "react";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { NavItemType } from "./navData";

type Props = {
  item: NavItemType;
};

export default function NavItem({ item }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* MAIN CATEGORY */}
      <Link
        href={`/category/${item.slug}`}
        className="flex items-center gap-1 hover:text-black transition"
      >
        {item.label}
        {item.children && <span className="text-xs">▾</span>}
      </Link>

      {/* DROPDOWN */}
      {open && item.children && (
        <Dropdown parentSlug={item.slug} items={item.children} />
      )}
    </div>
  );
}
