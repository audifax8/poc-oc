export interface IParams {
  applicationName: string;
  baseUrl: string;
  configureEndpoint: string;
  customerBaseUrl: string;
  environment: string;
  productBaseUrl: string;
  shouldSkipCache: boolean;
  product: number;
  productId: number;
  customer: number;
  customerId: number;
  workflow: string;
  apiKey: string;
  locale: string;
};

export interface ICore {
  loaded: boolean;
};

export interface IProduct {
  name: string;
  vendorId: string;
  currency: string;
};

export interface ILuxApi {
  loaded: boolean;
  enabled: boolean;
  on: boolean;
};

export interface ISkeleton {
  menuCas: any[];
};

export interface IUI {
  isMobile: boolean;
  darkMode: boolean,
  casToRender: any[];
  menuOpen: boolean;
};

export interface IState {
  core: ICore;
  params: IParams;
  product: IProduct;
  rtr: ILuxApi;
  rxc: ILuxApi;
  vm: ILuxApi;
  ui: IUI;
  skeleton: ISkeleton;
};