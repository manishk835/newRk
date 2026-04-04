export type Variant = {
    size: string;
    color: string;
    price: number;
    stock: number;
    sku: string;
    attributes: Record<string, string>;
  };
  
  export type ProductState = {
    name: string;
    description: string;
    category: string;
    subCategory: string;
    images: string[];
    variants: Variant[];
    features?: string;
  };

  export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft";
  images: string[];
  variants: Variant[];
  isApproved: boolean;
};