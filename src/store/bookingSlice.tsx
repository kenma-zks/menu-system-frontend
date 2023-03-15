import { createSlice } from '@reduxjs/toolkit'
import { IBookingData } from '../types/types'

import { PayloadAction } from '@reduxjs/toolkit/dist/createAction'

interface IBookingState {
  bookings: IBookingData[]
}

const initialState: IBookingState = {
  bookings: [],
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: initialState,
  reducers: {
    setBookings(state, action: PayloadAction<IBookingData[]>) {
      state.bookings = action.payload
    },
    updateBookings(state, action: PayloadAction<IBookingData>) {
      const { id, status } = action.payload
      const existingBooking = state.bookings.find(
        (booking) => booking.id === id,
      )
      if (existingBooking) {
        existingBooking.status = status
      }
    },
  },
})

export const { setBookings, updateBookings } = bookingsSlice.actions

export default bookingsSlice.reducer
