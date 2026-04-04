"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProduct } from "../context/ProductContext";
import { Variant } from "../types/product";

export default function PricingTable() {
  const { product, setProduct } = useProduct();

  const variants: Variant[] = product.variants || [];

  /* UPDATE VARIANT */
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

    setProduct((prev) => ({
      ...prev,
      variants: updated,
    }));
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
            {/* VARIANT */}
            <div className="text-sm flex items-center font-medium">
              {v.size} / {v.color}
            </div>

            {/* PRICE */}
            <Input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) =>
                updateVariant(i, "price", Number(e.target.value))
              }
            />

            {/* STOCK */}
            <Input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                updateVariant(i, "stock", Number(e.target.value))
              }
            />

            {/* SKU */}
            <Input
              placeholder="SKU"
              value={v.sku}
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