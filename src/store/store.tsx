import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./authSlice";
import categoriesSlice from "./categoriesSlice";
import productsSlice from "./productsSlice";
import bookingsSlice from "./bookingSlice";
import cartSlice from "./cartSlice";
import orderSlice from "./orderSlice";
import paymentSlice from "./paymentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesSlice,
    products: productsSlice,
    bookings: bookingsSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSlice,
    orders: orderSlice,
    payment: paymentSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
