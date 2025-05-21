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
    menuOpen: false,
    token: null,
    mainScriptsLoaded: false
  },
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setMenuOpen: (state, action) => {
      state.menuOpen = action.payload;
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    setMainScripsLoaded: (state, action) => {
      state.mainScriptsLoaded = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setIsMobile, setDarkMode, setMenuOpen, updateToken, setMainScripsLoaded } = uiSlice.actions;

export default uiSlice.reducer;