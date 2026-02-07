"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type PriceRange = {
  minPrice: number;
  maxPrice: number;
};

type Props = {
  priceRange: PriceRange;
};

export default function PriceFilter({ priceRange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlMin = Number(searchParams.get("minPrice")) || priceRange.minPrice;
  const urlMax = Number(searchParams.get("maxPrice")) || priceRange.maxPrice;

  const [min, setMin] = useState(urlMin);
  const [max, setMax] = useState(urlMax);

  useEffect(() => {
    setMin(urlMin);
    setMax(urlMax);
  }, [urlMin, urlMax]);

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
    router.push(`?${params.toString()}`);
  };

  const quickSelect = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
    router.push(`?${params.toString()}`);
  };

  if (!priceRange || priceRange.maxPrice === 0) return null;

  return (
    <div className="mb-6">
      <p className="font-medium mb-2">Price</p>

      {/* CURRENT RANGE */}
      <p className="text-sm text-gray-600 mb-3">
        ₹{min} – ₹{max}+
      </p>

      {/* SLIDER */}
      <div className="space-y-4">
        <input
          type="range"
          min={priceRange.minPrice}
          max={priceRange.maxPrice}
          value={min}
          onChange={(e) =>
            setMin(
              Math.min(Number(e.target.value), max - 1)
            )
          }
          className="w-full"
        />

        <input
          type="range"
          min={priceRange.minPrice}
          max={priceRange.maxPrice}
          value={max}
          onChange={(e) =>
            setMax(
              Math.max(Number(e.target.value), min + 1)
            )
          }
          className="w-full"
        />
      </div>

      {/* APPLY BUTTON */}
      <button
        onClick={applyPrice}
        className="mt-3 w-full border rounded-md py-1.5 text-sm hover:bg-gray-50"
      >
        Apply
      </button>

      {/* QUICK RANGES */}
      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <button
          onClick={() =>
            quickSelect(priceRange.minPrice, 450)
          }
          className="block hover:underline"
        >
          Up to ₹450
        </button>
        <button
          onClick={() => quickSelect(450, 600)}
          className="block hover:underline"
        >
          ₹450 – ₹600
        </button>
        <button
          onClick={() => quickSelect(600, 700)}
          className="block hover:underline"
        >
          ₹600 – ₹700
        </button>
        <button
          onClick={() => quickSelect(700, 900)}
          className="block hover:underline"
        >
          ₹700 – ₹900
        </button>
        <button
          onClick={() =>
            quickSelect(900, priceRange.maxPrice)
          }
          className="block hover:underline"
        >
          Over ₹900
        </button>
      </div>
    </div>
  );
}


// "use client";

// import { useRouter, useSearchParams } from "next/navigation";

// type PriceRange = {
//   minPrice: number;
//   maxPrice: number;
// };

// type PriceFilterProps = {
//   priceRange: PriceRange;
// };

// export default function PriceFilter({
//   priceRange,
// }: PriceFilterProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const applyRange = (min: number, max: number) => {
//     const params = new URLSearchParams(
//       searchParams.toString()
//     );

//     params.set("minPrice", String(min));
//     params.set("maxPrice", String(max));

//     router.push(`?${params.toString()}`);
//   };

//   const clearPrice = () => {
//     const params = new URLSearchParams(
//       searchParams.toString()
//     );
//     params.delete("minPrice");
//     params.delete("maxPrice");
//     router.push(`?${params.toString()}`);
//   };

//   if (!priceRange || priceRange.maxPrice === 0) {
//     return null;
//   }

//   return (
//     <div className="mb-6">
//       <p className="font-medium mb-3">Price</p>

//       <div className="space-y-2 text-sm text-gray-700">
//         <button
//           onClick={() =>
//             applyRange(
//               priceRange.minPrice,
//               999
//             )
//           }
//           className="block hover:underline"
//         >
//           Under ₹999
//         </button>

//         <button
//           onClick={() => applyRange(1000, 1999)}
//           className="block hover:underline"
//         >
//           ₹1000 – ₹1999
//         </button>

//         <button
//           onClick={() =>
//             applyRange(
//               2000,
//               priceRange.maxPrice
//             )
//           }
//           className="block hover:underline"
//         >
//           ₹2000+
//         </button>

//         <button
//           onClick={clearPrice}
//           className="block text-xs text-gray-500 mt-2"
//         >
//           Clear price filter
//         </button>
//       </div>
//     </div>
//   );
// }
