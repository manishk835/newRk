import { CartAction, CartState } from "./cart.types";

/* ================= INITIAL STATE ================= */

export const initialCartState: CartState = {
  items: [],
};

/* ================= REDUCER ================= */

export function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {

    /* -------- ADD TO CART -------- */
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;

      const existingItem = state.items.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product,
            quantity,
          },
        ],
      };
    }

    /* -------- INCREASE QTY -------- */
    case "INCREASE_QTY": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    /* -------- DECREASE QTY -------- */
    case "DECREASE_QTY": {
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.product._id === action.payload
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }

    /* -------- REMOVE -------- */
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            item.product._id !== action.payload
        ),
      };
    }

    /* -------- SET -------- */
    case "SET_CART":
      return action.payload;

    /* -------- CLEAR -------- */
    case "CLEAR_CART":
      return initialCartState;

    default:
      return state;
  }
}

// // // components/features/cart/cart.reducer.ts

// import { CartAction, CartState } from "./cart.types";

// /* ================= INITIAL STATE ================= */

// export const initialCartState: CartState = {
//   items: [],
// };

// /* ================= REDUCER ================= */

// export function cartReducer(
//   state: CartState,
//   action: CartAction
// ): CartState {
//   switch (action.type) {
//     /* -------- ADD TO CART -------- */
//     case "ADD_TO_CART": {
//       const existingItem = state.items.find(
//         (item) => item.product._id === action.payload._id
//       );

//       if (existingItem) {
//         return {
//           items: state.items.map((item) =>
//             item.product._id === action.payload._id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           ),
//         };
//       }

//       return {
//         items: [
//           ...state.items,
//           { product: action.payload, quantity: 1 },
//         ],
//       };
//     }

//     /* -------- INCREASE QTY -------- */
//     case "INCREASE_QTY": {
//       return {
//         items: state.items.map((item) =>
//           item.product._id === action.payload
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         ),
//       };
//     }

//     /* -------- DECREASE QTY -------- */
//     case "DECREASE_QTY": {
//       return {
//         items: state.items
//           .map((item) =>
//             item.product._id === action.payload
//               ? { ...item, quantity: item.quantity - 1 }
//               : item
//           )
//           .filter((item) => item.quantity > 0),
//       };
//     }

//     /* -------- REMOVE FROM CART -------- */
//     case "REMOVE_FROM_CART": {
//       return {
//         items: state.items.filter(
//           (item) => item.product._id !== action.payload
//         ),
//       };
//     }

//     /* -------- SET CART (LOCAL STORAGE / RESET) -------- */
//     case "SET_CART": {
//       return action.payload;
//     }

//     default:
//       return state;
//   }
// }
