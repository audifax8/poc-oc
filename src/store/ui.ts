import { createSlice } from '@reduxjs/toolkit';

import { isBrowser, isMobile, browserName, browserVersion } from 'react-device-detect';


export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    browserName,
    browserVersion,
    isBrowser,
    isMobile: isMobile,
    darkMode: false,
    casToRender: [],
    menuOpen: false
  },
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setCASToRender: (state, action) => {
      state.casToRender = action.payload;
    },
    setMenuOpen: (state, action) => {
      state.menuOpen = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setIsMobile, setDarkMode, setCASToRender, setMenuOpen } = uiSlice.actions;

export default uiSlice.reducer;