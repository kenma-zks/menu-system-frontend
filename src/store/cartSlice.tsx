import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/types";

interface CartState {
  cartItems: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addItemToCart(state: CartState, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex === -1) {
        state.cartItems.push({
          id: newItem.id,
          food_name: newItem.food_name,
          food_price: newItem.food_price,
          quantity: newItem.quantity,
          totalAmount: newItem.food_price,
        });
      } else {
        state.cartItems[existingItemIndex].quantity += newItem.quantity;
        state.cartItems[existingItemIndex].totalAmount =
          Number(state.cartItems[existingItemIndex].food_price) *
          state.cartItems[existingItemIndex].quantity;
      }
      state.totalQuantity += newItem.quantity;
      state.totalAmount += Number(newItem.food_price) * newItem.quantity;
    },

    removeItemFromCart(state: CartState, action: PayloadAction<number>) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      state.totalQuantity--;
      state.totalAmount -= Number(existingItem?.food_price);
      if (existingItem?.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      } else {
        existingItem!.quantity--;
        existingItem!.totalAmount =
          Number(existingItem!.totalAmount) - Number(existingItem!.food_price);
      }
    },
  },
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
