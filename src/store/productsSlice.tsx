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
    updateProduct(state, action: PayloadAction<IProductData>) {
      const {
        id,
        category_id,
        food_name,
        food_price,
        food_description,
        food_image,
        food_available,
      } = action.payload
      const existingProduct = state.products.find(
        (product) => product.id === id,
      )
      if (existingProduct) {
        existingProduct.category_id = category_id
        existingProduct.food_name = food_name
        existingProduct.food_price = food_price
        existingProduct.food_description = food_description
        existingProduct.food_image = food_image
        existingProduct.food_available = food_available
      }
    },

    deleteProduct(state, action: PayloadAction<number | undefined>) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      )
    },
  },
})

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions

export default productsSlice.reducer
