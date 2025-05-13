import { createSlice } from '@reduxjs/toolkit';
import { IMenu, IMenuCA } from '../interfaces';

export const menu = createSlice({
  name: 'menu',
  initialState: {
    cas: {}
  },
  reducers: {
    setCas: (state, action) => {
      console.log(action.payload);
      /*state.cas = action.payload.reduce(
        (acc: IMenu, curr: IMenuCA) => {
          console.log('@####');
          console.log({acc, curr});
          let test = {} as IMenu;
          test[curr.alias] = curr;
          return {
            ...test,
            ...acc
          };
        },
        {}
      );*/
      state.cas = action.payload;
    },
    updateSelectedAv: (state, action) => {
      const { caAlias, avId } = action.payload;
      console.log({caAlias, avId});
      //state.cas = action.payload;
    },
    setMenuOpen: (state, action) => {
      const { caAlias, open } = action.payload;
      console.log({caAlias, open});
      //state.cas = action.payload;
    },
    loadAVs: (state, action) => {
      const { caAlias } = action.payload;
      console.log({caAlias });
      //state.cas = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setCas, updateSelectedAv, setMenuOpen, loadAVs } = menu.actions;

export default menu.reducer;