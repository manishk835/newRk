import { Product } from "@/components/product/product.types";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "INCREASE_QTY"; payload: string }
  | { type: "DECREASE_QTY"; payload: string }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "SET_CART"; payload: CartState };
