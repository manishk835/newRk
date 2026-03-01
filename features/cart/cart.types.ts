// import { Product } from "@/components/ui/product/product.types";

// /* ================= CART ITEM ================= */

// export type CartItem = {
//   product: Product;
//   quantity: number;
// };

// /* ================= CART STATE ================= */

// export type CartState = {
//   items: CartItem[];
// };

// /* ================= CART ACTIONS ================= */

// export type CartAction =
//   | {
//     type: "ADD_TO_CART";
//     payload: {
//       product: Product;
//       variant?: {
//         size: string;
//         color: string;
//         sku: string;
//       };
//       quantity: number;
//     };
//   }
//   | {
//     type: "REMOVE_FROM_CART";
//     payload: string;
//   }
//   | {
//     type: "INCREASE_QTY";
//     payload: string;
//   }
//   | {
//     type: "DECREASE_QTY";
//     payload: string;
//   }
//   | {
//     type: "SET_CART";
//     payload: CartState;
//   }
//   | {
//     type: "CLEAR_CART";
//   };
import type { Product } from "@/components/ui/product/product.types";

/* ================= VARIANT ================= */

export type CartVariant = {
  size: string;
  color: string;
  sku: string;
};

/* ================= CART ITEM ================= */

export type CartItem = {
  product: Product;
  variant?: CartVariant;   // 🔥 IMPORTANT
  quantity: number;
};

/* ================= STATE ================= */

export type CartState = {
  items: CartItem[];
};

/* ================= ACTIONS ================= */

export type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: {
        product: Product;
        variant?: CartVariant;
        quantity: number;
      };
    }
  | {
      type: "INCREASE_QTY";
      payload: string; // productId (we improve later)
    }
  | {
      type: "DECREASE_QTY";
      payload: string;
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: string;
    }
  | {
      type: "SET_CART";
      payload: CartState;
    }
  | {
      type: "CLEAR_CART";
    };