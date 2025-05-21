import { createSlice } from '@reduxjs/toolkit';

import { RBN_CUSTOMER_ID, WAYFARER_ID } from '../constants/rbn';

const urlSearchParams = new URLSearchParams(window.location.search);
const queryParams = Object.fromEntries(urlSearchParams.entries());
const {
  workflow,
  customer,
  customerId,
  product,
  productId,
  avoidLuxAPI,
  avoidRTR,
  mockPreloadAssets,
  fluidEnv,
  showBackgroundImg,
  rtrLoader,
  rtrTimeOut,
} = queryParams;

const parseBoolParam = (paramToParse: string | undefined) => {
  if (paramToParse === undefined) {
    return false;
  }
  if (paramToParse === '') {
    return true;
  }
  return paramToParse === 'true' ? true : false;
};

export const paramsSlice = createSlice({
  name: 'fc',
  initialState: {
    params: {
      applicationName: 'configure-core',
      baseUrl: '//cdn-development.fluidconfigure.com/static/assets/prod/prod',
      configureEndpoint: 'development.fluidconfigure.com',
      customerBaseUrl: '//cdn-development.fluidconfigure.com/static/assets/prod/prod/customers/c1581/configureHtml/',
      environment: 'prod',
      productBaseUrl: '//cdn-development.fluidconfigure.com/static/assets/prod/prod/customers/c1581/configureHtml/products/p_22956/',
      shouldSkipCache: false,
      product: product || WAYFARER_ID,
      productId: productId || WAYFARER_ID,
      customer: customer || RBN_CUSTOMER_ID,
      customerId: customerId || RBN_CUSTOMER_ID,
      workflow: workflow || 'prod',
      apiKey: 'LUX-Ray-Ban-8taOhSR5AFyjt9tfxU',
      locale: 'en_US',
      brand: 'rbn',
      fluidEnv: parseBoolParam(fluidEnv),
      avoidLuxAPI: parseBoolParam(avoidLuxAPI),
      avoidRTR: parseBoolParam(avoidRTR),
      mockPreloadAssets: parseBoolParam(mockPreloadAssets),
      showBackgroundImg: parseBoolParam(showBackgroundImg),
      rtrLoader: parseBoolParam(rtrLoader !== undefined ? rtrLoader : 'true'),
      rtrTimeOut: rtrTimeOut !== undefined ? parseInt(rtrTimeOut) : 8000 //8 seconds
    }
  },
  reducers: {
    setParams: (state, action) => {
      const { payload } = action;
      state.params = payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setParams } = paramsSlice.actions;

export default paramsSlice.reducer;