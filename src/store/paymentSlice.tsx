import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    isPaymentSuccess: false,
  },
  reducers: {
    setPaymentSuccess(state) {
      state.isPaymentSuccess = true;
    },
    setPaymentComplete(state) {
      state.isPaymentSuccess = false;
    },
  },
});

export const { setPaymentSuccess, setPaymentComplete } = paymentSlice.actions;

export default paymentSlice.reducer;
