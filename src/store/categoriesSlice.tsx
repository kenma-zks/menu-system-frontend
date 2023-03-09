import { createSlice } from '@reduxjs/toolkit'
import { authState, ICategoryData, tokenState } from '../types/types'

import { PayloadAction } from '@reduxjs/toolkit/dist/createAction'

interface ICategoryState {
  categories: ICategoryData[]
}

const initialState: ICategoryState = {
  categories: [],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState,
  reducers: {
    setCategories(state, action: PayloadAction<ICategoryData[]>) {
      state.categories = action.payload
    },
    addCategory(state, action: PayloadAction<ICategoryData>) {
      state.categories.push(action.payload)
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      )
    },
    updateCategory(state, action: PayloadAction<ICategoryData>) {
      const { id, category_name } = action.payload
      const existingCategory = state.categories.find(
        (category) => category.id === id,
      )
      if (existingCategory) {
        existingCategory.category_name = category_name
      }
    },
  },
})

export const {
  setCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} = categoriesSlice.actions

export default categoriesSlice.reducer
