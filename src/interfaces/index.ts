import { ReactNode } from 'react';

declare global {
  interface Window {
    rtrViewerMV: any;
    _configure: any;
    vmmv: any;
    _rxcData: any;
    RXC: any;
    RXC_LOADED: boolean;
  }
};
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
  brand: string;
  avoidRTR: boolean;
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
  loading: boolean,
  failed: boolean,
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
export interface IAttributeValue {
  active: boolean;
  selected: boolean;
  selectable: boolean;
  id: number;
  url?: string;
  vendorId: string;
  alias: string;
  name: string;
  metadata: any[];
};
export interface IConfigurableAttribute {
  id: number;
  alias: string;
  vendorId: string;
  name: string;
  values: IAttributeValue[];
  metadata: any[];
};
export interface IProduct {
  name: string;
  id: number;
  vendorId: string;
};
export interface IAttributeValue {
  active: boolean;
  selected: boolean;
  selectable: boolean;
  id: number;
  url?: string;
  vendorId: string;
  alias: string;
  name: string;
  metadata: any[];
};

export enum RenderType {
  '3D' = '3D',
  '2D' = '2D',
};
export interface ICAMap {
  id: number | null;
  alias: string;
  icon: string;
  ca?: IConfigurableAttribute | null;
  selectedAvId: number | null;
  selectedAv?: IAttributeValue | null;
  skeleton?: boolean;
};
export interface IAttributeValue {
  active: boolean;
  selected: boolean;
  selectable: boolean;
  id: number;
  url?: string;
  vendorId: string;
  alias: string;
  name: string;
  metadata: any[];
};
export interface ICoreService {
  getProduct(): any;
  getProductName(): string;
  getRecipe(format: string, option1?: string, option2?: string): any;
  getAttribute(options: any): IConfigurableAttribute;
  getAttributeByAlias(alias: string): IConfigurableAttribute;
  getSelectedAV(alias: string): IAttributeValue;
};

export interface IProviderProps {
  children: ReactNode;
};

export interface ILuxBase {
  getToken(): string;
  decodeToken(): any[];
  mapCas():  ICAMap[];
  coreService: ICoreService;
};

export interface IRTRService {
  getVersion(): string;
  init(token: string): void;
};

export interface IVMMVService {
  isBrowserSupported(): Promise<boolean>;
};
