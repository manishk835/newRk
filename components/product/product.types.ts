// components/product/product.types.ts

/**
 * Product Variant (size + stock)
 * Example: S, M, L, XL
 */
export type ProductVariant = {
  size: string;
  stock: number;
};

/**
 * Product Rating & Reviews summary
 */
export type ProductRating = {
  average: number; // 4.2
  count: number;   // total reviews
};

/**
 * Main Product type (REAL ECOMMERCE LEVEL)
 */
export type Product = {
  /* ================= CORE ================= */
  _id: string;              // MongoDB id
  title: string;
  slug: string;

  /* ================= PRICING ================= */
  price: number;
  originalPrice?: number;
  currency?: "INR";

  /* ================= MEDIA ================= */
  images: string[];         // Cloudinary URLs
  thumbnail?: string;       // optional hero image

  /* ================= CATEGORY ================= */
  category: string;         // men / women / kids
  subCategory?: string;     // tshirts / jeans / shoes
  brand?: string;

  /* ================= INVENTORY ================= */
  inStock: boolean;
  stock?: number;           // total stock
  variants?: ProductVariant[];

  /* ================= PRODUCT DETAILS ================= */
  description?: string;     // long description
  highlights?: string[];    // bullet points
  material?: string;
  fit?: string;             // Regular / Slim
  care?: string;            // Wash care

  /* ================= RATINGS ================= */
  rating?: ProductRating;

  /* ================= META ================= */
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isbestSellers?:boolean;
  isActive?: boolean;

  /* ================= TIMESTAMPS ================= */
  createdAt?: string;
  updatedAt?: string;

  
};
