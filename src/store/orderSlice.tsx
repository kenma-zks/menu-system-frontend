import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderData } from "../types/types";

interface OrderState {
  orders: IOrderData[];
}

const initialState: OrderState = {
  orders: [],
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
    },
    addOrder(state, action: PayloadAction<IOrderData>) {
      state.orders.push(action.payload);
    },
    updateOrderStatus(state, action: PayloadAction<IOrderData>) {
      const orderIndex = state.orders.findIndex(
        (order) => order.order_id === action.payload.order_id
      );
      state.orders[orderIndex] = action.payload;
    },
  },
});

export const { setOrders, deleteOrder, addOrder, updateOrderStatus } =
  orderSlice.actions;

export default orderSlice.reducer;
