import { configureStore } from '@reduxjs/toolkit';
import configureCore from './core';
import model from './model';
import product from './product';
import params from './params';
import rtr from './rtr';
import rxc from './rxc';
import vm from './vm';
import ui from './ui';
import skeleton from './skeleton';

export default configureStore({
  reducer: {
    configureCore,
    model,
    product,
    params,
    rtr,
    rxc,
    vm,
    ui,
    skeleton
  },
});