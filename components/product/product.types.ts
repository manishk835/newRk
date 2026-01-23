// components/product/product.types.ts

export type Product = {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    inStock: boolean;
  };
  