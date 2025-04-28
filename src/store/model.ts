import { createSlice } from '@reduxjs/toolkit';

export const modelSlice = createSlice({
  name: 'model',
  initialState: {
    skeleton: true,
    '2D': false,
    '3D': false
  },
  reducers: {
    set2D: (state, action) => {
      state['2D'] = action.payload;
    },
    set3D: (state, action) => {
      state['3D'] = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { set2D, set3D } = modelSlice.actions;

export default modelSlice.reducer;