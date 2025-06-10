import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import configure_assets from '../workers/configure-assets';

import { IState, IProviderProps } from '../interfaces';

import { setProduct } from '../store/product';
import { setModelAssetsPreloaded } from '../store/rtr';
import { updateToken, setMainScripsLoaded } from '../store/ui';
import { setLoaded } from '../store/core';
import { setCas } from '../store/menu';

import { CoreService } from '../services/core';
import { RBNService } from '../services/rbn';

const createCore = require('@cfg.plat/configure-core');
const LuxAPIContext = createContext({});

export function useLuxAPI(): any {
  return useContext(LuxAPIContext);
}

export function LuxAPIWorkerProvider(props: IProviderProps) {
  const { params } = useSelector((state: IState) => state?.fc);
  if (params.timesDebug) {
    console.time('fetchConfigureAssets');
  }
  const dispatch = useDispatch();
  const { children } = props;
  const [luxService, setLuxService] = useState<any>();

  useEffect(() => {
    // Create a new web worker
    const myWorker = new Worker(configure_assets);

    // Set up event listener for messages from the worker
    myWorker.onmessage = function (event) {
      if (params.timesDebug) {
        console.timeEnd('fetchConfigureAssets');
        console.time('createCoreInstance');
      }
      const { productGraph, preferences } = event.data;

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
              if (params.timesDebug) {
                console.timeEnd('createCoreInstance');
              }
              console.error(error);
              myWorker.terminate();
              return;
            }
            if (params.timesDebug) {
              console.timeEnd('createCoreInstance');
            }
            const _cService = new CoreService(configureCore);
            const _rbnService = new RBNService(_cService);

            const token = _rbnService.getToken();
            dispatch(updateToken(token));

            const product = _cService.getProduct();
            dispatch(setProduct(product));

            const cas = _rbnService.mapCas();
            dispatch(setCas(cas));

            setLuxService(_rbnService);
            dispatch(setLoaded(true));
            myWorker.terminate();
          }
        );
    };
    myWorker.postMessage(params);

    // Clean up the worker when the component unmounts
    return () => {
      myWorker.terminate();
    };
  }, []); // Run this effect only once when the component mounts

  const value = { luxService };
  return (
    <LuxAPIContext.Provider value={value}>
      {children}
    </LuxAPIContext.Provider>
  );
};
