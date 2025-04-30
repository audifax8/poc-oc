import { createSlice } from '@reduxjs/toolkit';

export const vmSlice = createSlice({
  name: 'vm',
  initialState: {
    loading: true,
    failed: false,
    loaded: false,
    enabled: false,
    on: false
  },
  reducers: {
    setPatch: (state, action) => {
      const { payload: { loaded, loading, failed, enabled } } = action;
      state.loaded = loaded;
      state.loading = loading;
      state.failed = failed;
      state.enabled = enabled;
    },
    setScriptLoaded: (state, action) => {
      state.loaded = action.payload;
    },
    setEnabled: (state, action) => {
      state.enabled = action.payload;
    },
    setOn: (state, action) => {
      state.on = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setScriptLoaded, setEnabled, setOn, setPatch } = vmSlice.actions;

export default vmSlice.reducer;