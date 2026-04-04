"use client";

import { createContext, useContext, useState } from "react";

type Variant = {
  size: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
};

type ProductState = {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  images: string[];
  variants: Variant[];
  features?: string; // 🔥 ADD THIS
};

type ProductContextType = {
  product: ProductState;
  setProduct: React.Dispatch<React.SetStateAction<ProductState>>;
};

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<ProductState>({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    images: [],
    variants: [],
  });

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside ProductProvider");
  return ctx;
};