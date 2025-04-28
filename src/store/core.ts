import { createSlice } from '@reduxjs/toolkit';

export const core = createSlice({
  name: 'core',
  initialState: {
    loaded: false
  },
  reducers: {
    setLoaded: (state, action) => {
      state.loaded = action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoaded } = core.actions;

export default core.reducer;