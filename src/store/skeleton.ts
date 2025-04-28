import { createSlice } from '@reduxjs/toolkit';

export const skeleton = createSlice({
  name: 'core',
  initialState: {
    menuCas: [
      {
        id: 0,
        alias: 'frame_sku',
        icon: 'frame',
        selectedAvId: null,
        skeleton: true
      },
      {
        id: 1,
        alias: 'lenses_sku',
        icon: 'lens',
        selectedAvId: null,
        skeleton: true
      },    
      {
        id: 2,
        alias: 'temple_tips_sku',
        icon: 'temple',
        selectedAvId: null,
        skeleton: true
      }
    ],
  },
  reducers: {
    /*setLoaded: (state, action) => {
      state.loaded = action.payload
    }*/
  },
});

// Action creators are generated for each case reducer function
export const { } = skeleton.actions;

export default skeleton.reducer;