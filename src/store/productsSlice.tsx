import { createSlice } from '@reduxjs/toolkit'
import { IProductData } from '../types/types'
import { PayloadAction } from '@reduxjs/toolkit'

interface productsState {
  products: IProductData[]
}

const initialState: productsState = {
  products: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<IProductData[]>) {
      state.products = action.payload
    },
    addProduct(state, action: PayloadAction<IProductData>) {
      state.products.push(action.payload)
    },
  },
})

export const { setProducts, addProduct } = productsSlice.actions

export default productsSlice.reducer
