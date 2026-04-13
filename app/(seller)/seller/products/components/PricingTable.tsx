"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Variant = {
  name: string;
  attributes?: Record<string, any>;
  stock?: number;
  sku?: string;
  priceOverride?: number;
};

type Props = {
  product: any;
  setProduct: (data: any) => void;
};

export default function PricingTable({ product, setProduct }: Props) {
  const variants: Variant[] = product.variants || [];

  /* ================= UPDATE VARIANT ================= */
  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const updated = [...variants];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setProduct((prev: any) => ({
      ...prev,
      variants: updated,
    }));
  };

  /* ================= VARIANT LABEL ================= */
  const getVariantLabel = (v: Variant) => {
    if (v.name) return v.name;

    if (v.attributes) {
      return Object.values(v.attributes).join(" / ");
    }

    return "Variant";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing & Inventory</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">

        {variants.length === 0 && (
          <p className="text-sm text-gray-500">
            Generate variants first
          </p>
        )}

        {variants.map((v, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-3 border p-3 rounded-lg"
          >
            {/* VARIANT NAME */}
            <div className="text-sm flex items-center font-medium">
              {getVariantLabel(v)}
            </div>

            {/* PRICE OVERRIDE */}
            <Input
              type="number"
              placeholder="Price"
              value={v.priceOverride || ""}
              onChange={(e) =>
                updateVariant(i, "priceOverride", Number(e.target.value))
              }
            />

            {/* STOCK */}
            <Input
              type="number"
              placeholder="Stock"
              value={v.stock || ""}
              onChange={(e) =>
                updateVariant(i, "stock", Number(e.target.value))
              }
            />

            {/* SKU */}
            <Input
              placeholder="SKU"
              value={v.sku || ""}
              onChange={(e) =>
                updateVariant(i, "sku", e.target.value)
              }
            />
          </div>
        ))}

      </CardContent>
    </Card>
  );
}