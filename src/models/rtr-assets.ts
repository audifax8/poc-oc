import { preload } from 'react-dom';
import prefecthMock from './prefetch-mock.json';

const ALIAS_RTR_ON_COMPONENT_SELECT = {
  lenses_sku: 'lenses',
  polarized: 'lenses',
  lenses_category: 'lenses',
  prescription: 'lenses',
  lenses_options: 'lenses',
  frame_sku: 'frame',
  metal_details: 'frame',
  matrial: 'frame',
  temple_sku: 'temple',
  temple_tips_category: 'temple_tips',
  temple_tips_sku: 'temple_tips'
} as any;

const getAssetsURL = (configure: any, params: any) => {

  const modelVendorId = configure.getProduct().vendorId;
  let size;
  const sizeCA = configure.getAttribute({ alias: 'size' });
  const selectedSize = sizeCA.values.find((av: any) => av.selected);
  const SIZE_REGEX = new RegExp('[a-zA-Z0-9]*[s]*?([0-9]{2})');
  size = SIZE_REGEX.exec(selectedSize.vendorId) as any [];
  if (!size) {
    const productFacets = configure.getProduct().facets;
    if (productFacets.product_size && productFacets.product_size[0]) {
      size = productFacets.product_size;
    }
  }
  const modelCodeSize = modelVendorId + size[0];
  const prefetchAssetsBaseURL =
    '//_HOST_PREFIX-__CATALOG_HOST_/_MOCK_OR_REAL_VERSION_/v1/prefetch/_MODEL_CODE_SIZE_?qa=_QA_VALUE_';
  return prefetchAssetsBaseURL
    .replace('_HOST_PREFIX-_','')
    .replace('_CATALOG_HOST_', 'cp.luxottica.com')
    .replace('_MOCK_OR_REAL_VERSION_', 'public')
    .replace('_MODEL_CODE_SIZE_', modelCodeSize)
    .replace('_QA_VALUE_', 'false');
};

const getRTRScriptURL = (params: any) => {
  const RTR_SCRIPT_URL =
  '//_RTR_ENV_rtrmv.essilorluxottica.com/lib/v/_RTR_VERSION_/main.umd.js';
  const { rtrOverrideScriptURL } = params;
  if (rtrOverrideScriptURL !== undefined) {
    return rtrOverrideScriptURL;
  }

  const { rtrVersion } = params;
  const rtrV = rtrVersion || '3.0.3';
  return RTR_SCRIPT_URL
    .replace('_RTR_ENV_', '')
    .replace('_RTR_VERSION_', rtrV);
};

export class RTR_ASSETS {
  configure: any;
  params: any;
  preloadedData: any;
  assetsAlreadyPreloaded: string[];
  RTRScriptURL: string;

  constructor(configure: any, params: any) {
    this.configure = configure;
    this.params = params;
    this.preloadedData = null;
    this.assetsAlreadyPreloaded = [];
    this.RTRScriptURL = getRTRScriptURL(params);
  }

  debugLog = (log: any, isJSON?: boolean) => {
    const { rtrDebug } = this.params;
    if (rtrDebug) {
      return isJSON ? console.log(log) : console.info('RTR: ' + log);
    }
  };

  getAssetsURL = () => getAssetsURL(this.configure, this.params);

  preloadAssets = (caAlias: string) => {
    if (this.preloadedData) {
      const { prefetchListConfigurableAttributes } = this.preloadedData;
      const key = ALIAS_RTR_ON_COMPONENT_SELECT[caAlias] as string;

      const isAlreadyDonwloaded =
        this.assetsAlreadyPreloaded.find((name) => name === key);

      if (isAlreadyDonwloaded) {
        return;
      }

      this.assetsAlreadyPreloaded.push(key);
      if (key && prefetchListConfigurableAttributes[key.toUpperCase()]) {
        this.fetchAssets(
          prefetchListConfigurableAttributes[key.toUpperCase()],
          key
        );
      }
    }
  };

  prefetch = (url: string) => preload(
    url,
    { as: 'fetch', crossOrigin: 'anonymous' }
  );

  fetchAssets = (assets: any[], type: string) => {
    if (assets && assets.length) {
      this.debugLog(`downloading assets: ${type}`);
      this.debugLog(assets, true);
      assets.forEach((url) => this.prefetch(url));
    }
  };

  getPreloadAssetsURL = () => {
    const url = getAssetsURL(this.configure, this.params);
    return url;
  };

  downloadAssets = async () => {
    const {
      skipPreloadAssets,
      mockPreloadAssets,
      rtrOverridePreloadAssetsURL
    } = this.params;
    let url;
    if (mockPreloadAssets) {
      this.debugLog('using preload assets mock');
      this.preloadedData = prefecthMock;
      this.debugLog(prefecthMock, true);
      return;
    }
    if (skipPreloadAssets) {
      this.debugLog('skip preload assets');
      return;
    }

    url = this.getPreloadAssetsURL();
    if (rtrOverridePreloadAssetsURL) {
      url = rtrOverridePreloadAssetsURL;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.preloadedData = data;
      this.debugLog(`assets to preload`);
      this.debugLog(data, true);
      return data;
    } catch (e) {
      this.debugLog(`error prealoading assets`);
      this.debugLog(e, true);
      return null;
    }
  };

  waitForScriptToLoad = (checkTimeMs: number, timeOutMs: number) => {
    let elapsedTime = 0;
    const loaded = false;
    return new Promise((resolve) => {
      const time = setInterval(() => {
        elapsedTime += checkTimeMs;
        if (this.preloadedData) {
          clearInterval(time);
          return resolve({
            time: elapsedTime,
            result: true
          });
        } else if (elapsedTime > timeOutMs && !loaded) {
          clearInterval(time);
          return resolve({
            time: elapsedTime,
            result: false
          });
        }
      }, checkTimeMs);
    });
  };

  preloadStartupAssets = async () => {
    const { skipPreloadAssets } = this.params;
    if (skipPreloadAssets) {
      return;
    }

    const modelAssets = 'prefetchListStartup';
    const isAlreadyDonwloaded =
      this.assetsAlreadyPreloaded
        .find((name) => name === modelAssets);

    if (isAlreadyDonwloaded) {
      return;
    }

    const preloadModelAssets = () => {
      const { prefetchListStartup } = this.preloadedData;
      this.fetchAssets(prefetchListStartup, modelAssets);
      this.assetsAlreadyPreloaded.push(modelAssets);
      const ocHierarchy = this.params.ocHierarchy;
      const prefetchListHierarchy = this.preloadedData.prefetchListHierarchy;
      if (ocHierarchy && prefetchListHierarchy) {
        this.fetchAssets(
          prefetchListHierarchy[ocHierarchy],
          'prefetchListHierarchy'
        );
        this.assetsAlreadyPreloaded.push('prefetchListHierarchy');
      }
    };

    if (this.preloadedData) {
      return preloadModelAssets();
    }

    const { result } = await this.waitForScriptToLoad(100, 20000) as any;
    if (result) {
      return preloadModelAssets();
    }
  };
}
