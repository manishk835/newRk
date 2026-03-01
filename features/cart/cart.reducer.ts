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

    /* ================= ADD TO CART ================= */
    case "ADD_TO_CART": {
      const { product, variant, quantity } =
        action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.product._id === product._id &&
          item.variant?.sku === variant?.sku
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === product._id &&
            item.variant?.sku === variant?.sku
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { product, variant, quantity },
        ],
      };
    }

    /* ================= INCREASE ================= */
    case "INCREASE_QTY": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };
    }

    /* ================= DECREASE ================= */
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

    /* ================= REMOVE ================= */
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            item.product._id !== action.payload
        ),
      };
    }

    /* ================= SET ================= */
    case "SET_CART":
      return action.payload;

    /* ================= CLEAR ================= */
    case "CLEAR_CART":
      return initialCartState;

    default:
      return state;
  }
}
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
//       const { product, quantity } = action.payload;

//       const existingItem = state.items.find(
//         (item) => item.product._id === product._id
//       );

//       if (existingItem) {
//         return {
//           ...state,
//           items: state.items.map((item) =>
//             item.product._id === product._id
//               ? {
//                   ...item,
//                   quantity: item.quantity + quantity,
//                 }
//               : item
//           ),
//         };
//       }

//       return {
//         ...state,
//         items: [
//           ...state.items,
//           {
//             product,
//             quantity,
//           },
//         ],
//       };
//     }

//     /* -------- INCREASE QTY -------- */
//     case "INCREASE_QTY": {
//       return {
//         ...state,
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
//         ...state,
//         items: state.items
//           .map((item) =>
//             item.product._id === action.payload
//               ? {
//                   ...item,
//                   quantity: item.quantity - 1,
//                 }
//               : item
//           )
//           .filter((item) => item.quantity > 0),
//       };
//     }

//     /* -------- REMOVE -------- */
//     case "REMOVE_FROM_CART": {
//       return {
//         ...state,
//         items: state.items.filter(
//           (item) =>
//             item.product._id !== action.payload
//         ),
//       };
//     }

//     /* -------- SET -------- */
//     case "SET_CART":
//       return action.payload;

//     /* -------- CLEAR -------- */
//     case "CLEAR_CART":
//       return initialCartState;

//     default:
//       return state;
//   }
// }
