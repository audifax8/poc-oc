import { configureStore } from '@reduxjs/toolkit';
import core from './core';
import model from './model';
import product from './product';
import fc from './params';
import rtr from './rtr';
import rxc from './rxc';
import vm from './vm';
import ui from './ui';
import skeleton from './skeleton';
import menu from './menu';

export default configureStore({
  reducer: {
    core,
    model,
    product,
    fc,
    rtr,
    rxc,
    vm,
    ui,
    skeleton,
    menu
  },
});