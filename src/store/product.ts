import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    name: '',
    vendorId: '',
    currency: 'USD'
  },
  reducers: {
    setProduct: (state, action) => {
      const { vendorId, name } = action.payload;
      state.name = name;
      state.vendorId = vendorId;
      //state.currency = action.payload.currency;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProduct } = productSlice.actions;

export default productSlice.reducer;