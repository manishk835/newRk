// cart.types.ts
import type { Product } from "@/components/ui/product/product.types";

/* ================= VARIANT ================= */

export type CartVariant = {
  size: string;
  color: string;
  sku: string;
  stock: number;            // 🔥 important (validation ke liye)
  priceOverride?: number;   // 🔥 variant pricing support
};

/* ================= CART ITEM ================= */

export type CartItem = {
  product: Product;
  variant: CartVariant;     // ❗ now REQUIRED (no optional)
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
        variant: CartVariant;   // ❗ required
        quantity: number;
      };
    }
  | {
      type: "INCREASE_QTY";
      payload: {
        productId: string;
        size: string;
        color: string;
      };
    }
  | {
      type: "DECREASE_QTY";
      payload: {
        productId: string;
        size: string;
        color: string;
      };
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: {
        productId: string;
        size: string;
        color: string;
      };
    }
  | {
      type: "SET_CART";
      payload: CartState;
    }
  | {
      type: "CLEAR_CART";
    };
// // cart.types.ts
// import type { Product } from "@/components/ui/product/product.types";

// /* ================= VARIANT ================= */

// export type CartVariant = {
//   size: string;
//   color: string;
//   sku: string;
// };

// /* ================= CART ITEM ================= */

// export type CartItem = {
//   product: Product;
//   variant?: CartVariant;   // 🔥 IMPORTANT
//   quantity: number;
// };

// /* ================= STATE ================= */

// export type CartState = {
//   items: CartItem[];
// };

// /* ================= ACTIONS ================= */

// export type CartAction =
//   | {
//       type: "ADD_TO_CART";
//       payload: {
//         product: Product;
//         variant?: CartVariant;
//         quantity: number;
//       };
//     }
//   | {
//       type: "INCREASE_QTY";
//       payload: string; // productId (we improve later)
//     }
//   | {
//       type: "DECREASE_QTY";
//       payload: string;
//     }
//   | {
//       type: "REMOVE_FROM_CART";
//       payload: string;
//     }
//   | {
//       type: "SET_CART";
//       payload: CartState;
//     }
//   | {
//       type: "CLEAR_CART";
//     };