// // components/product/product.types.ts

/* ======================================================
   PRODUCT VARIANT
====================================================== */
export type ProductVariant = {
  _id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  priceOverride?: number;
  isActive?: boolean;
};

/* ======================================================
   PRODUCT IMAGE
====================================================== */
export type ProductImage = {
  url: string;
  alt?: string;
  order?: number;
};

/* ======================================================
   SELLER SNAPSHOT (OPTIONAL UI USE)
====================================================== */
export type ProductSeller = {
  _id: string;
  name?: string;
  email?: string;
};

/* ======================================================
   MAIN PRODUCT TYPE (BACKEND ALIGNED)
====================================================== */
export type Product = {
  /* ================= CORE ================= */
  _id: string;
  title: string;
  slug: string;

  /* ================= BRAND & CATEGORY ================= */
  category: string;
  subCategory?: string;
  brand?: string;
  tags?: string[];

  /* ================= PRICING ================= */
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency?: string;
  taxInclusive?: boolean;

  /* ================= MEDIA ================= */
  thumbnail: string;
  images?: ProductImage[];

  /* ================= INVENTORY ================= */
  variants?: ProductVariant[];
  totalStock: number;              // 🔥 NOW REQUIRED
  inStock?: boolean;               // optional fallback
  maxOrderQty?: number;

  /* ================= SELLER ================= */
  seller: string | ProductSeller;  // 🔥 IMPORTANT

  /* ================= PRODUCT DETAILS ================= */
  description?: string;
  shortDescription?: string;
  material?: string;
  fit?: string;
  pattern?: string;
  sleeve?: string;
  occasion?: string;
  careInstructions?: string;
  countryOfOrigin?: string;

  /* ================= DELIVERY ================= */
  codAvailable?: boolean;
  returnDays?: number;
  replacementDays?: number;
  deliveryEstimate?: string;

  /* ================= RATINGS ================= */
  rating?: number;
  reviewsCount?: number;

  /* ================= FLAGS ================= */
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;

  /* ================= META ================= */
  createdAt?: string;
  updatedAt?: string;
};

// // components/product/product.types.ts
// /* ======================================================
//    PRODUCT VARIANT
// ====================================================== */
// export type ProductVariant = {
//   size: string;
//   color: string;
//   stock: number;
//   sku: string;
//   priceOverride?: number;
//   isActive?: boolean;
// };

// /* ======================================================
//    PRODUCT IMAGE
// ====================================================== */
// export type ProductImage = {
//   url: string;
//   alt?: string;
//   order?: number;
// };

// /* ======================================================
//    MAIN PRODUCT TYPE (BACKEND ALIGNED)
// ====================================================== */
// export type Product = {
//   /* ================= CORE ================= */
//   _id: string;
//   title: string;
//   slug: string;

//   /* ================= BRAND & CATEGORY ================= */
//   category: string;
//   subCategory?: string;
//   brand?: string;
//   tags?: string[];

//   /* ================= PRICING ================= */
//   price: number;
//   originalPrice?: number;
//   discountPercent?: number;
//   currency?: string;
//   taxInclusive?: boolean;

//   /* ================= MEDIA ================= */
//   thumbnail: string;
//   images?: ProductImage[];

//   /* ================= INVENTORY ================= */
//   variants?: ProductVariant[];
//   totalStock?: number;
//   inStock: boolean;
//   maxOrderQty?: number;

//   /* ================= PRODUCT DETAILS ================= */
//   description?: string;
//   shortDescription?: string;
//   material?: string;
//   fit?: string;
//   pattern?: string;
//   sleeve?: string;
//   occasion?: string;
//   careInstructions?: string;
//   countryOfOrigin?: string;

//   /* ================= DELIVERY ================= */
//   codAvailable?: boolean;
//   returnDays?: number;
//   replacementDays?: number;
//   deliveryEstimate?: string;

//   /* ================= RATINGS ================= */
//   rating?: number;          // backend uses number
//   reviewsCount?: number;    // backend uses number

//   /* ================= FLAGS ================= */
//   isFeatured?: boolean;
//   isNewArrival?: boolean;
//   isBestSeller?: boolean;
//   isActive?: boolean;

//   /* ================= META ================= */
//   createdAt?: string;
//   updatedAt?: string;


// };
