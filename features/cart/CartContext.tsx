"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { cartReducer, initialCartState } from "./cart.reducer";
import { CartAction, CartState } from "./cart.types";

/* ================= CONTEXT TYPE ================= */

type CartContextType = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

/* ================= PROVIDER ================= */

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState
  );

  /* -------- LOAD CART FROM LOCAL STORAGE -------- */
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");

      if (storedCart) {
        const parsed: CartState = JSON.parse(storedCart);
        dispatch({ type: "SET_CART", payload: parsed });
      }
    } catch (err) {
      console.error("Failed to load cart from storage");
    }
  }, []);

  /* -------- SAVE CART TO LOCAL STORAGE -------- */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
