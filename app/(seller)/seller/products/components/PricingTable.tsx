"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

/* ================= TYPES ================= */

type Variant = {
  name: string;

  attributes?: Record<
    string,
    any
  >;

  stock?: number;

  sku?: string;

  priceOverride?: number;
};

type Props = {
  product: any;

  setProduct: (
    data: any
  ) => void;
};

/* ================= COMPONENT ================= */

export default function PricingTable({
  product,
  setProduct,
}: Props) {

  const variants: Variant[] =
    product.variants || [];

  /* ================= UPDATE VARIANT ================= */

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value:
      | string
      | number
  ) => {

    const updated = [
      ...variants,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setProduct(
      (prev: any) => ({
        ...prev,
        variants: updated,
      })
    );
  };

  /* ================= LABEL ================= */

  const getVariantLabel = (
    v: Variant
  ) => {

    if (v.name)
      return v.name;

    if (v.attributes) {
      return Object.values(
        v.attributes
      ).join(" / ");
    }

    return "Variant";
  };

  return (
    <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">

      <CardHeader>

        <CardTitle className="text-black dark:text-white">
          Pricing & Inventory
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">

        {/* EMPTY */}
        {variants.length === 0 && (

          <div className="bg-gray-50 dark:bg-zinc-800/50 border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6 text-center">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate variants first
            </p>

          </div>

        )}

        {/* VARIANTS */}
        {variants.map(
          (
            v,
            i
          ) => (

            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 bg-gray-50 dark:bg-zinc-800/40 transition-colors duration-300"
            >

              {/* VARIANT NAME */}
              <div className="flex items-center">

                <div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Variant
                  </p>

                  <p className="text-sm font-medium text-black dark:text-white wrap-break-words">
                    {getVariantLabel(
                      v
                    )}
                  </p>

                </div>

              </div>

              {/* PRICE */}
              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Price
                </p>

                <Input
                  type="number"
                  placeholder="Price"
                  value={
                    v.priceOverride ||
                    ""
                  }
                  onChange={(
                    e
                  ) =>
                    updateVariant(
                      i,
                      "priceOverride",
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
                />

              </div>

              {/* STOCK */}
              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Stock
                </p>

                <Input
                  type="number"
                  placeholder="Stock"
                  value={
                    v.stock || ""
                  }
                  onChange={(
                    e
                  ) =>
                    updateVariant(
                      i,
                      "stock",
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
                />

              </div>

              {/* SKU */}
              <div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  SKU
                </p>

                <Input
                  placeholder="SKU"
                  value={
                    v.sku || ""
                  }
                  onChange={(
                    e
                  ) =>
                    updateVariant(
                      i,
                      "sku",
                      e.target
                        .value
                    )
                  }
                  className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
                />

              </div>

            </div>

          )
        )}

      </CardContent>

    </Card>
  );
}