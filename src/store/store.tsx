import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import authReducer from './authSlice'
import categoriesSlice from './categoriesSlice'
import productsSlice from './productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesSlice,
    products: productsSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
