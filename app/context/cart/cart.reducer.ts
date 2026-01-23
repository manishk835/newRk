import { CartState, CartAction } from "./cart.types";

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }

    case "INCREASE_QTY":
      return {
        items: state.items.map((item) =>
          item.product.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREASE_QTY":
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "REMOVE_FROM_CART":
      return {
        items: state.items.filter(
          (item) => item.product.id !== action.payload
        ),
      };

    case "SET_CART":
      return action.payload;

    default:
      return state;
  }
}
