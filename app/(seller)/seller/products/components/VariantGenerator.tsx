"use client";

import { useState } from "react";
import { useProduct } from "../context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Attr = {
  name: string;
  values: string[];
};

export default function VariantGenerator() {
  const { setProduct } = useProduct();

  const [attributes, setAttributes] = useState<Attr[]>([
    { name: "Size", values: [] },
    { name: "Color", values: [] },
  ]);

  const [input, setInput] = useState<{ [key: string]: string }>({});

  /* ADD VALUE */
  const addValue = (attrIndex: number) => {
    const value = input[attrIndex];
    if (!value) return;

    const updated = [...attributes];
    if (!updated[attrIndex].values.includes(value)) {
      updated[attrIndex].values.push(value);
    }

    setAttributes(updated);
    setInput({ ...input, [attrIndex]: "" });
  };

  /* REMOVE VALUE */
  const removeValue = (attrIndex: number, value: string) => {
    const updated = [...attributes];
    updated[attrIndex].values = updated[attrIndex].values.filter(
      (v) => v !== value
    );
    setAttributes(updated);
  };

  /* GENERATE VARIANTS */
  const generateVariants = () => {
    if (attributes.length < 1) return;

    const [first, second] = attributes;

    let combos: any[] = [];

    if (second) {
      first.values.forEach((a) => {
        second.values.forEach((b) => {
          combos.push({
            size: a,
            color: b,
            price: 0,
            stock: 0,
            sku: `${a}-${b}`,
          });
        });
      });
    } else {
      first.values.forEach((a) => {
        combos.push({
          size: a,
          color: "",
          price: 0,
          stock: 0,
          sku: a,
        });
      });
    }

    setProduct((prev) => ({
      ...prev,
      variants: combos,
    }));
  };

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">

      <h2 className="font-semibold">Variants</h2>

      {attributes.map((attr, index) => (
        <div key={index} className="space-y-2">

          <p className="text-sm font-medium">{attr.name}</p>

          {/* INPUT */}
          <div className="flex gap-2">
            <Input
              placeholder={`Add ${attr.name}`}
              value={input[index] || ""}
              onChange={(e) =>
                setInput({ ...input, [index]: e.target.value })
              }
            />
            <Button onClick={() => addValue(index)}>
              Add
            </Button>
          </div>

          {/* CHIPS */}
          <div className="flex gap-2 flex-wrap">
            {attr.values.map((v) => (
              <span
                key={v}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {v}
                <button
                  onClick={() => removeValue(index, v)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

        </div>
      ))}

      {/* GENERATE BUTTON */}
      <Button className="w-full" onClick={generateVariants}>
        Generate Variants
      </Button>

    </div>
  );
}