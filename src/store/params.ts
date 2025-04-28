import { createSlice } from '@reduxjs/toolkit';
//import { RBN_CUSTOMER_ID, WAYFARER_ID } from '../constants';

export const MEGA_WAYFARER_ID = 26101;
export const RBN_CUSTOMER_ID = 1581;
export const WAYFARER_ID = 22972;

export const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    applicationName: 'configure-core',
    baseUrl: '//cdn-development.fluidconfigure.com/static/assets/prod/prod',
    configureEndpoint: 'development.fluidconfigure.com',
    customerBaseUrl: '//cdn-development.fluidconfigure.com/static/assets/prod/prod/customers/c1581/configureHtml/',
    environment: 'prod',
    productBaseUrl: '//cdn-development.fluidconfigure.com/static/assets/prod/prod/customers/c1581/configureHtml/products/p_22956/',
    shouldSkipCache: false,
    product: WAYFARER_ID,
    productId: WAYFARER_ID,
    customer: RBN_CUSTOMER_ID,
    customerId: RBN_CUSTOMER_ID,
    workflow: 'prod',
    apiKey: 'LUX-Ray-Ban-8taOhSR5AFyjt9tfxU',
    locale: 'en_US'
  },
  reducers: {
    setParams: (state, action) => {
      state = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setParams } = paramsSlice.actions;

export default paramsSlice.reducer;