import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { preload } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { setProduct } from '../store/product';
import { setModelAssetsPreloaded } from '../store/rtr';
import { updateToken } from '../store/ui';
import { setLoaded } from '../store/core';
import { setCas } from '../store/menu';
import { setParams } from '../store/params';

import { IState, IProviderProps, ILuxBase } from '../interfaces';

import { CoreService } from '../services/core';
import { RBNService } from '../services/rbn';

import { RTR_ASSETS } from '../models/rtr-assets';
import { useRTR } from './rtr';

//import * as sampleComponents from './sample-components';

const createCore = require('@cfg.plat/configure-core');

const LuxAPIContext = createContext({});

export function useLuxAPI(): any {
  return useContext(LuxAPIContext);
}

export function LuxAPIProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const { setRTRAssets } = useRTR();
  const { params } = useSelector((state: IState) => state?.fc);
  const [queryParameters] = useSearchParams();
  const { children } = props;
  const [luxService, setLuxService] = useState<ILuxBase>();
  useEffect(() => {
    const queryWorkflow = queryParameters?.get('workflow');
    const queryCustomer = queryParameters?.get('customer');
    const queryProduct = queryParameters?.get('product');
    const avoidRTR = queryParameters?.get('avoidRTR');
    const mockPreloadAssets = queryParameters?.get('mockPreloadAssets');
    const queryBrand = queryParameters?.get('brand');
    const mergedParams = {
      ...params,
      workflow: queryWorkflow || params.workflow,
      customer: queryCustomer || params.customer,
      customerId: queryCustomer || params.customer,
      product: queryProduct || params.product,
      productId: queryProduct || params.product,
      brand: queryBrand || params.brand,
      avoidRTR: avoidRTR === 'true' ? true : false,
      mockPreloadAssets: mockPreloadAssets === 'true' ? true : false
    };

    const { workflow, product, customer, locale, brand } = mergedParams;
    const graphUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/graph-settings-${locale}.json`;
    const preferencesUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/preferences.json`;
    /*const uiSettings =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/ui-settings-${locale}.json`;*/

    Promise.all([
      fetch(graphUrl),
      fetch(preferencesUrl),
      //fetch(uiSettings)
    ])
    .then(async (
      [
        productGraphResponse,
        preferencesResponse,
        //uiSettingsResponse
      ]
    ) => {
      //if (productGraphResponse.ok && preferencesResponse.ok && uiSettingsResponse.ok) {
      if (productGraphResponse.ok && preferencesResponse.ok) {
        const productGraph = await productGraphResponse.json();
        const preferences = await preferencesResponse.json();
        //const uiSettings = await uiSettingsResponse.json();
        //console.log(sampleComponents);

        createCore(
          {
            productGraph,
            preferences,
            productOverrides: {
              // allows you to see on the console how overrides are being applied
              // when using the non production version of the runtime
              debug: false,
              // if AVs that are set to {active:false} by valueUsage overrides below
              // should still be displayed on the UI, but not selectable
              // also you can use an object on this property to define what, not active
              // ca's, you want to display:
              //
              // renderInactive: {
              //   ca_alias : {true|false}
              // }
              //
              //renderInactive: true, // default: false
              //196886, dark gray classic
              values: {
                '1RB00500862L7_GRIDFK': {
                  valueUsages: {
                    '1RB00500862L7_GRIDFK': {
                      upcharge: {
                        us: 10,
                        mx: 5,
                        de: 8
                      },
                      active: false
                    }
                  }
                },
              }
            },
            ...mergedParams,
          },
          (error: any, configureCore: any) => {
            if (error) {
              console.error(error);
              return;
            }
            const rtrAssets = new RTR_ASSETS(configureCore, mergedParams);
            const url = rtrAssets.getAssetsURL();
            preload(url, {as: 'fetch', crossOrigin: 'anonymous'});
            rtrAssets.downloadAssets();

            const _cService = new CoreService(configureCore);
            const _rbnService = new RBNService(_cService);
            const token = _rbnService.getToken();
            dispatch(updateToken(token));

            const product = _cService.getProduct();
            dispatch(setLoaded(true));
            dispatch(setProduct(product));
            dispatch(setParams(mergedParams));
            //rtrAssets.prefetch(url);
            //TODO
            const test = _rbnService.mapCas2();
            dispatch(setCas(test));
            setLuxService(_rbnService);
            rtrAssets.preloadStartupAssets();
            dispatch(setModelAssetsPreloaded(true));
            setRTRAssets(rtrAssets);
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });

  },[]);
  const value = { luxService };
  return (
    <LuxAPIContext.Provider value={value}>
      {children}
    </LuxAPIContext.Provider>
  );
};
