import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderData } from "../types/types";

interface OrderState {
  orders: IOrderData[];
  isOrderPlaced: boolean;
}

const initialState: OrderState = {
  orders: [],
  isOrderPlaced: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    setOrders(state, action: PayloadAction<IOrderData[]>) {
      state.orders = action.payload;
    },
    deleteOrder(state, action: PayloadAction<number | undefined>) {
      state.orders = state.orders.filter(
        (order) => order.order_id !== action.payload
      );
      state.isOrderPlaced = false;
    },
    addOrder(state, action: PayloadAction<IOrderData>) {
      state.orders.push(action.payload);
      state.isOrderPlaced = true;
    },
  },
});

export const { setOrders, deleteOrder, addOrder } = orderSlice.actions;

export default orderSlice.reducer;
