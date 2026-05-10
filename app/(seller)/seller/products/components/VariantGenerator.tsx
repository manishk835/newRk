"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

/* ================= TYPES ================= */

type Attr = {
  name: string;
  values: string[];
};

type Props = {
  product: any;

  setProduct: (
    data: any
  ) => void;
};

/* ================= COMPONENT ================= */

export default function VariantGenerator({
  product,
  setProduct,
}: Props) {

  const [attributes, setAttributes] =
    useState<Attr[]>([
      {
        name: "Size",
        values: [],
      },

      {
        name: "Color",
        values: [],
      },
    ]);

  const [input, setInput] =
    useState<{
      [key: number]: string;
    }>({});

  /* ================= ADD VALUE ================= */

  const addValue = (
    attrIndex: number
  ) => {

    const value =
      input[
        attrIndex
      ]?.trim();

    if (!value) return;

    const updated = [
      ...attributes,
    ];

    if (
      !updated[
        attrIndex
      ].values.includes(value)
    ) {
      updated[
        attrIndex
      ].values.push(value);
    }

    setAttributes(updated);

    setInput({
      ...input,
      [attrIndex]: "",
    });
  };

  /* ================= REMOVE VALUE ================= */

  const removeValue = (
    attrIndex: number,
    value: string
  ) => {

    const updated = [
      ...attributes,
    ];

    updated[
      attrIndex
    ].values =
      updated[
        attrIndex
      ].values.filter(
        (v) => v !== value
      );

    setAttributes(updated);
  };

  /* ================= COMBINATIONS ================= */

  const generateCombinations = (
    attrs: Attr[]
  ) => {

    if (!attrs.length)
      return [];

    let result: any[] = [
      {},
    ];

    attrs.forEach(
      (attr) => {

        const temp: any[] =
          [];

        result.forEach(
          (res) => {

            attr.values.forEach(
              (val) => {

                temp.push({
                  ...res,

                  [attr.name.toLowerCase()]:
                    val,
                });

              }
            );

          }
        );

        result = temp;

      }
    );

    return result;
  };

  /* ================= GENERATE ================= */

  const generateVariants = () => {

    const validAttrs =
      attributes.filter(
        (a) =>
          a.values.length >
          0
      );

    if (
      validAttrs.length ===
      0
    ) {

      alert(
        "Add at least one attribute"
      );

      return;
    }

    const combos =
      generateCombinations(
        validAttrs
      );

    const variants =
      combos.map(
        (
          combo: any,
          i: number
        ) => {

          const name =
            Object.values(
              combo
            ).join(" / ");

          return {
            name,

            attributes:
              combo,

            stock: 0,

            sku: name
              .replace(
                /\s+/g,
                "-"
              )
              .toUpperCase(),

            priceOverride: 0,
          };
        }
      );

    setProduct(
      (prev: any) => ({
        ...prev,
        variants,
      })
    );
  };

  /* ================= ADD ATTRIBUTE ================= */

  const addAttribute = () => {

    setAttributes([
      ...attributes,

      {
        name: "",
        values: [],
      },
    ]);
  };

  /* ================= UPDATE NAME ================= */

  const updateAttrName = (
    index: number,
    value: string
  ) => {

    const updated = [
      ...attributes,
    ];

    updated[index].name =
      value;

    setAttributes(updated);
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-6 shadow-sm transition-colors duration-300">

      {/* HEADER */}
      <div>

        <h2 className="font-semibold text-black dark:text-white">
          Variants
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create product combinations like Size, Color, Storage etc.
        </p>

      </div>

      {/* ATTRIBUTES */}
      {attributes.map(
        (
          attr,
          index
        ) => (

          <div
            key={index}
            className="space-y-3 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-gray-50 dark:bg-zinc-800/40"
          >

            {/* NAME */}
            <Input
              placeholder="Attribute Name (Size, Color)"
              value={
                attr.name
              }
              onChange={(e) =>
                updateAttrName(
                  index,
                  e.target.value
                )
              }
              className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
            />

            {/* VALUE INPUT */}
            <div className="flex gap-2">

              <Input
                placeholder="Add value"
                value={
                  input[index] ||
                  ""
                }
                onChange={(e) =>
                  setInput({
                    ...input,

                    [index]:
                      e.target
                        .value,
                  })
                }
                className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-black dark:text-white"
              />

              <Button
                type="button"
                onClick={() =>
                  addValue(
                    index
                  )
                }
                className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition"
              >
                Add
              </Button>

            </div>

            {/* VALUES */}
            <div className="flex gap-2 flex-wrap">

              {attr.values.map(
                (v) => (

                  <span
                    key={v}
                    className="bg-gray-200 dark:bg-zinc-700 text-black dark:text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >

                    {v}

                    <button
                      type="button"
                      onClick={() =>
                        removeValue(
                          index,
                          v
                        )
                      }
                      className="text-red-500 text-xs hover:opacity-80"
                    >
                      ✕
                    </button>

                  </span>

                )
              )}

            </div>

          </div>

        )
      )}

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={
            addAttribute
          }
          className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          + Add Attribute
        </Button>

        <Button
          type="button"
          className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition"
          onClick={
            generateVariants
          }
        >
          Generate Variants
        </Button>

      </div>

      {/* INFO */}
      {product?.variants
        ?.length > 0 && (

        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-3">

          <p className="text-sm text-green-700 dark:text-green-300">
            ✅{" "}
            {
              product
                .variants
                .length
            }{" "}
            variants generated successfully
          </p>

        </div>

      )}

    </div>
  );
}