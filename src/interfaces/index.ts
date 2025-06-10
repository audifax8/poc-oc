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
  avoidLuxAPI: boolean;
  fluidEnv: boolean;
  mockPreloadAssets: boolean;
  showBackgroundImg: boolean;
  rtrTimeOut: number;
  rtrLoader: boolean;
  timesDebug: boolean;
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
  camera: string;
  modelAssetsPreloaded: boolean;
};
export interface ISkeleton {
  menuCas: any[];
};

export interface IUI {
  isMobile: boolean;
  isBrowser: boolean;
  darkMode: boolean;
  menuOpen: boolean;
  token: string;
  mainScriptsLoaded: boolean;
};

export interface IMenuCA {
  id: number;
  alias: string;
  caName: string;
  icon: string;
  selectedAvId: number | null;
  selectedAvName: string;
  avs: IAttributeValue[];
  open: boolean;
  avsLenght: number;
  currentPage: number;
  skeleton?: boolean;
};

export interface IMenuPagination {
  avs: IAttributeValue[];
  currentPage: number;
  avsLenght: number;
};
export interface IMenu {
  cas: IMenuCA[];
}
export interface IState {
  core: ICore;
  fc: {
    params: IParams
  };
  product: IProduct;
  rtr: ILuxApi;
  rxc: ILuxApi;
  vm: ILuxApi;
  ui: IUI;
  skeleton: ISkeleton;
  menu: IMenu;
};
export interface IFacetValue {
  id: number;
  name: string;
  selectable: boolean;
};

export interface ICAFacet {
  name: string;
  id: number;
  facetValues: IFacetValue[];
};

export interface IAVFacet {
  [key: string]: number[];
};

export interface IFacetFacetValueMap {
  id?: number;
  name?: string;
  facetValuesMapped?: IFacetValue;
}
export interface IConfigurableAttribute {
  id: number;
  alias: string;
  vendorId: string;
  name: string;
  values: IAttributeValue[];
  metadata: any[];
  allFacets: ICAFacet[];
};
export interface IProduct {
  name: string;
  id: number;
  vendorId: string;
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
  facets: IAVFacet;
};

export interface IAttributeHeaderPropTypes {
  onClick: Function;
  caInfo: IMenuCA;
};
export interface ICoreService {
  getProduct(): any;
  getProductName(): string;
  getRecipe(format: string, option1?: string, option2?: string): any;
  getAttribute(options: any): IConfigurableAttribute;
  getAttributeByAlias(alias: string): IConfigurableAttribute;
  getSelectedAV(alias: string): IAttributeValue;
  setRecipe(changes: any[], callback: Function): void;
  on(eventName: string, callback: Function): void;
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
  init(token: string, cb?: Function): any;
  isIdAvailable(token: string): any;
  setId(token: string): void;
  selectComponent(token: number): void;
  mapCameraNameRTRToComponent(caName: string): number;
  mapCaNameToRTRCameraName(caAlias: string): string;
};

export interface IVMMVService {
  isBrowserSupported(): Promise<boolean>;
};

export interface IRXCService {
  renderRxc(): Promise<boolean>;
};
