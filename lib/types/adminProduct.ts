// lib/types/adminProduct.ts

export type AdminProduct = {
    _id: string;
    title: string;
    price: number;
    category: string;
    subCategory?: string;
  
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
  
    createdAt: string;
  };
  