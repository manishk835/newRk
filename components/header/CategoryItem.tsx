// components/header/CategoryItem.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "./types";
import CategoryDropdown from "./CategoryDropdown";

type Props = {
  parent: Category;
  allCategories: Category[]; // already children
};

export default function CategoryItem({
  parent,
  allCategories,
}: Props) {
  const [open, setOpen] = useState(false);

  // ✅ HYBRID MODE: allCategories = children directly
  const children = allCategories;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* MAIN CATEGORY */}
      <Link
        href={`/category/${parent.slug}`}
        className="relative flex items-center gap-1 text-gray-700 hover:text-black transition"
      >
        <span className="relative">
          {parent.name}
          <span
            className={`absolute left-0 -bottom-1 h-0.5 w-full bg-[#F5A623]
            transition-transform duration-200 origin-left
            ${open ? "scale-x-100" : "scale-x-0"}`}
          />
        </span>

        {children.length > 0 && (
          <span
            className={`text-xs transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        )}
      </Link>

      {/* DROPDOWN */}
      {open && children.length > 0 && (
        <CategoryDropdown
          parentSlug={parent.slug}
          items={children}
        />
      )}
    </div>
  );
}


// // components/header/CategoryItem.tsx

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Category } from "./types";
// import CategoryDropdown from "./CategoryDropdown";

// type Props = {
//   parent: Category;
//   allCategories: Category[];
// };

// export default function CategoryItem({
//   parent,
//   allCategories,
// }: Props) {
//   const [open, setOpen] = useState(false);

//   const children = allCategories.filter(
//     (c) => c.parent === parent._id
//   );

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* MAIN CATEGORY */}
//       <Link
//         href={`/category/${parent.slug}`}
//         className="relative flex items-center gap-1 text-gray-700 hover:text-black transition"
//       >
//         <span className="relative">
//           {parent.name}
//           <span
//             className={`absolute left-0 -bottom-1 h-0.5 w-full bg-[#F5A623]
//             transition-transform duration-200 origin-left
//             ${open ? "scale-x-100" : "scale-x-0"}`}
//           />
//         </span>

//         {children.length > 0 && (
//           <span
//             className={`text-xs transition-transform duration-200 ${
//               open ? "rotate-180" : ""
//             }`}
//           >
//             ▾
//           </span>
//         )}
//       </Link>

//       {/* DROPDOWN */}
//       {open && children.length > 0 && (
//         <CategoryDropdown
//           parentSlug={parent.slug}
//           items={children}
//         />
//       )}
//     </div>
//   );
// }
