"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Attr = {
  name: string;
  values: string[];
};

type Props = {
  product: any;
  setProduct: (data: any) => void;
};

export default function VariantGenerator({ product, setProduct }: Props) {

  const [attributes, setAttributes] = useState<Attr[]>([
    { name: "Size", values: [] },
    { name: "Color", values: [] },
  ]);

  const [input, setInput] = useState<{ [key: number]: string }>({});

  /* ================= ADD VALUE ================= */
  const addValue = (attrIndex: number) => {
    const value = input[attrIndex]?.trim();
    if (!value) return;

    const updated = [...attributes];

    if (!updated[attrIndex].values.includes(value)) {
      updated[attrIndex].values.push(value);
    }

    setAttributes(updated);
    setInput({ ...input, [attrIndex]: "" });
  };

  /* ================= REMOVE VALUE ================= */
  const removeValue = (attrIndex: number, value: string) => {
    const updated = [...attributes];
    updated[attrIndex].values = updated[attrIndex].values.filter(
      (v) => v !== value
    );
    setAttributes(updated);
  };

  /* ================= COMBINATION GENERATOR ================= */
  const generateCombinations = (attrs: Attr[]) => {
    if (!attrs.length) return [];

    let result: any[] = [{}];

    attrs.forEach((attr) => {
      const temp: any[] = [];

      result.forEach((res) => {
        attr.values.forEach((val) => {
          temp.push({
            ...res,
            [attr.name.toLowerCase()]: val,
          });
        });
      });

      result = temp;
    });

    return result;
  };

  /* ================= GENERATE VARIANTS ================= */
  const generateVariants = () => {
    const validAttrs = attributes.filter((a) => a.values.length > 0);

    if (validAttrs.length === 0) {
      alert("Add at least one attribute");
      return;
    }

    const combos = generateCombinations(validAttrs);

    const variants = combos.map((combo: any, i: number) => {
      const name = Object.values(combo).join(" / ");

      return {
        name,
        attributes: combo,
        stock: 0,
        sku: name.replace(/\s+/g, "-").toUpperCase(),
        priceOverride: 0,
      };
    });

    setProduct((prev: any) => ({
      ...prev,
      variants,
    }));
  };

  /* ================= ADD NEW ATTRIBUTE ================= */
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", values: [] }]);
  };

  /* ================= UPDATE ATTRIBUTE NAME ================= */
  const updateAttrName = (index: number, value: string) => {
    const updated = [...attributes];
    updated[index].name = value;
    setAttributes(updated);
  };

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">

      <h2 className="font-semibold">Variants</h2>

      {attributes.map((attr, index) => (
        <div key={index} className="space-y-2">

          {/* ATTRIBUTE NAME */}
          <Input
            placeholder="Attribute Name (e.g. Size, Color)"
            value={attr.name}
            onChange={(e) => updateAttrName(index, e.target.value)}
          />

          {/* INPUT */}
          <div className="flex gap-2">
            <Input
              placeholder={`Add value`}
              value={input[index] || ""}
              onChange={(e) =>
                setInput({ ...input, [index]: e.target.value })
              }
            />
            <Button onClick={() => addValue(index)}>
              Add
            </Button>
          </div>

          {/* VALUES */}
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

      {/* ADD ATTRIBUTE */}
      <Button variant="outline" onClick={addAttribute}>
        + Add Attribute
      </Button>

      {/* GENERATE */}
      <Button className="w-full" onClick={generateVariants}>
        Generate Variants
      </Button>

    </div>
  );
}