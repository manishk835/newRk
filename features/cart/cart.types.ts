import { Product } from "@/components/ui/product/product.types";

/* ================= CART ITEM ================= */

export type CartItem = {
  product: Product;
  quantity: number;
};

/* ================= CART STATE ================= */

export type CartState = {
  items: CartItem[];
};

/* ================= CART ACTIONS ================= */

export type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: Product;
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: string; // product._id
    }
  | {
      type: "INCREASE_QTY";
      payload: string; // product._id
    }
  | {
      type: "DECREASE_QTY";
      payload: string; // product._id
    }
  | {
      type: "SET_CART";
      payload: CartState;
    };
