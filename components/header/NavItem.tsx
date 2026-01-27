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
      {/* MAIN NAV ITEM */}
      <Link
        href={`/category/${item.slug}`}
        className={`
          relative flex items-center gap-1
          text-gray-700
          transition-colors duration-200
          hover:text-black
        `}
      >
        {/* LABEL */}
        <span className="relative">
          {item.label}

          {/* underline animation */}
          <span
            className={`
              absolute left-0 -bottom-1 h-0.5 w-full
              bg-[#F5A623]
              transform origin-left
              transition-transform duration-200
              ${open ? "scale-x-100" : "scale-x-0"}
            `}
          />
        </span>

        {/* caret */}
        {item.children && (
          <span
            className={`
              text-xs transition-transform duration-200
              ${open ? "rotate-180" : "rotate-0"}
            `}
          >
            ▾
          </span>
        )}
      </Link>

      {/* DROPDOWN */}
      {open && item.children && (
        <Dropdown parentSlug={item.slug} items={item.children} />
      )}
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Dropdown from "./Dropdown";
// import { NavItemType } from "./navData";

// type Props = {
//   item: NavItemType;
// };

// export default function NavItem({ item }: Props) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* MAIN CATEGORY */}
//       <Link
//         href={`/category/${item.slug}`}
//         className="flex items-center gap-1 hover:text-black transition"
//       >
//         {item.label}
//         {item.children && <span className="text-xs">▾</span>}
//       </Link>

//       {/* DROPDOWN */}
//       {open && item.children && (
//         <Dropdown parentSlug={item.slug} items={item.children} />
//       )}
//     </div>
//   );
// }
