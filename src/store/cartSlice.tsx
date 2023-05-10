import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, IOrderData } from "../types/types";
import Cookies from "js-cookie";

interface CartState {
  cartItems: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  paymentMethod: string;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
    paymentMethod: "",
  },
  reducers: {
    setCart(state: CartState, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
    },
    setTotalQuantity(state: CartState, action: PayloadAction<number>) {
      state.totalQuantity = action.payload;
    },
    setTotalAmount(state: CartState, action: PayloadAction<number>) {
      state.totalAmount = action.payload;
    },
    clearCart(state: CartState) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
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
          food_image: newItem.food_image,
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

export const {
  addItemToCart,
  removeItemFromCart,
  setCart,
  setTotalQuantity,
  setTotalAmount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
