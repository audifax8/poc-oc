import { createSlice } from '@reduxjs/toolkit';
import { IMenu, IMenuCA } from '../interfaces';

export const menu = createSlice({
  name: 'menu',
  initialState: {
    cas: []
  },
  reducers: {
    setCas: (state, action) => {
      state.cas = action.payload;
    },
    updateSelectedAv: (state, action) => {
      const { caAlias, avId, name } = action.payload;
      state.cas = state.cas.map((ca: IMenuCA) => {
        if (ca.alias === caAlias) {
          return {
            ...ca,
            selectedAvId: avId,
            selectedAvName: name
          };
        }
        return {
          ...ca
        };
      }) as never[];
    },
    setMenuOpen: (state, action) => {
      const { caAlias, open } = action.payload;
      state.cas = state.cas.map((ca: IMenuCA) => {
        if (ca.alias === caAlias) {
          return {
            ...ca,
            open
          };
        }
        return {
          ...ca
        };
      }) as never[];
    },
    loadAVs: (state, action) => {
      const { caAlias, newData } = action.payload;
      state.cas = state.cas.map((ca: IMenuCA) => {
        if (ca.alias === caAlias) {
          return {
            ...ca,
            ...newData
          };
        }
        return {
          ...ca
        };
      }) as never[];
    }
  },
});

// Action creators are generated for each case reducer function
export const { setCas, updateSelectedAv, setMenuOpen, loadAVs } = menu.actions;

export default menu.reducer;