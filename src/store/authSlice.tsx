import { createSlice } from '@reduxjs/toolkit'
import { authState, tokenState } from '../types/types'
import jwt_decode from 'jwt-decode'
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction'

const initialState: authState = {
  authTokens: localStorage.getItem('authTokens')
    ? JSON.parse(localStorage.getItem('authTokens')!)
    : null,
  user: localStorage.getItem('authTokens')
    ? jwt_decode(JSON.parse(localStorage.getItem('authTokens')!)?.access)
    : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ authTokens: tokenState }>) {
      const { authTokens } = action.payload

      state.authTokens = action.payload.authTokens

      if (authTokens) {
        state.user = jwt_decode(authTokens.access)
      }
      localStorage.setItem('authTokens', JSON.stringify(authTokens))
    },
    logOut(state) {
      state.authTokens = null
      state.user = null
      localStorage.removeItem('authTokens')
    },
  },
})

export const authActions = authSlice.actions

export default authSlice.reducer
