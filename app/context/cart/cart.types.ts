// context/cart/cart.types.ts
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
  | { type: "REMOVE_FROM_CART"; payload: string } // product id
  | { type: "CLEAR_CART" };
