export type Variant = {
  name: string;
  attributes?: Record<string, any>;
  stock?: number;
  sku?: string;
  priceOverride?: number;
};

export type Product = {
  _id?: string;

  name: string;
  category: string;
  subCategory?: string;

  price: number;
  description?: string;
  features?: string;

  attributes?: Record<string, any>;

  images?: {
    url: string;
    public_id?: string;
  }[];

  thumbnail?: string;

  variants?: Variant[];

  isApproved?: boolean;
  isActive?: boolean;
};