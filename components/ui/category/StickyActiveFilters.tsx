"use client";

import { useEffect, useState } from "react";
import ActiveFilterChips from "@/components/ui/category/ActiveFilterChips";

export default function StickyActiveFilters() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 220);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <div
      className={`transition-all duration-300
      ${
        isSticky
          ? "sticky top-18 z-30 bg-white border-b shadow-sm"
          : "relative"
      }`}
    >
      <div className="container mx-auto px-6 py-3">
        <ActiveFilterChips />
      </div>
    </div>
  );
}
