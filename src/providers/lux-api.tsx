import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { preload } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setProduct } from '../store/product';
import { setModelAssetsPreloaded } from '../store/rtr';
import { updateToken, setMainScripsLoaded } from '../store/ui';
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
  const { children } = props;
  const [luxService, setLuxService] = useState<ILuxBase>();
  useEffect(() => {
    const { workflow, product, customer, locale, avoidLuxAPI, fluidEnv } = params;
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
            ...params,
          },
          (error: any, configureCore: any) => {
            if (error) {
              console.error(error);
              return;
            }
            const rtrAssets = new RTR_ASSETS(configureCore, params);
            if (avoidLuxAPI) {
              if (fluidEnv) {
                console.log('Avoid preloading RTR Assets by param avoidLuxAPI');
              }
            } else {
              const url = rtrAssets.getAssetsURL();
              preload(
                url,
                { as: 'fetch', crossOrigin: 'anonymous' }
              );
              rtrAssets.downloadAssets();
            }

            const _cService = new CoreService(configureCore);
            const _rbnService = new RBNService(_cService);
            const token = _rbnService.getToken();
            dispatch(updateToken(token));

            const product = _cService.getProduct();
            dispatch(setLoaded(true));
            dispatch(setProduct(product));
            dispatch(setParams(params));
            dispatch(setCas(_rbnService.mapCas()));
            setLuxService(_rbnService);
            if (avoidLuxAPI) {
              if (fluidEnv) {
                console.log('Avoid preloading Startup Assets RTR Assets by param avoidLuxAPI');
              }
            } else {
              rtrAssets.preloadStartupAssets();
              dispatch(setModelAssetsPreloaded(true));
            }
            setRTRAssets(rtrAssets);
            dispatch(setMainScripsLoaded(true));
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
