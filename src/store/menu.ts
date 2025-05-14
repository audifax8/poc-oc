import { createSlice } from '@reduxjs/toolkit';
import { IMenu, IMenuCA } from '../interfaces';

export const menu = createSlice({
  name: 'menu',
  initialState: {
    cas: []
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
      const oldCas = state.cas as IMenuCA[];
      const newCas = oldCas.map((ca) => {
        if (ca.alias === caAlias) {
          const ne = {...ca, open};
          console.log(ne);
          return {
            ...ca,
            open,
          };
        }
        const ne = {...ca};
        console.log(ne);
        return ne;
      }) as never[];
      console.log({caAlias, open, oldCas, newCas});
      state.cas = newCas;
      //state.cas = 
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