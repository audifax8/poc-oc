import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useLuxAPI } from './lux-api-web-worker';
import { useRTR } from './rtr';

import rtr_assets from '../workers/rtr-assets';

import { IState, IProviderProps } from '../interfaces';

import { setPatch } from '../store/rtr';
import { RTR_ASSETS } from '../models/rtr-assets';

const RTRAssetsContext = createContext({});

export function useRTRAssets(): any {
  return useContext(RTRAssetsContext);
}

export function RTRAssetsWorkerProvider(props: IProviderProps) {
  const { luxService } = useLuxAPI();
  const { rtrService } = useRTR();
  const dispatch = useDispatch();
  const { params } = useSelector((state: IState) => state?.fc);
  const { loaded } = useSelector((state: IState) => state?.core);
  const rtrState = useSelector((state: IState) => state?.rtr);

  if (params.timesDebug) {
    console.time('fetchRTRAssets');
  }
  
  const { children } = props;

  const [rtrAssets, setRTRAssets] = useState<RTR_ASSETS>();

  useEffect(() => {
    if (params.avoidRTR) {
      if (params.fluidEnv) {
        console.log(`RTR Assets: Not loaded by param avoidRTR`);
      }
      return;
    }

    if (!loaded || !rtrState.loaded) {
      return;
    }
    // Create a new web worker
    const myWorker = new Worker(rtr_assets);

    // Set up event listener for messages from the worker
    myWorker.onmessage = function (event) {
      if (params.timesDebug) {
        console.timeEnd('fetchRTRAssets');
      }
      const { result } = event.data;
      if (result) {
        if (params.fluidEnv) {
          console.log(`RTR Assets: Script loaded`);
        }
      }
      if (params.fluidEnv) {
        console.log(`RTR: Assets Error loading script`);
      }
      return myWorker.terminate();
    };
    myWorker.postMessage(
      {
        params,
        rtrService,
        luxService
      }
    );

    // Clean up the worker when the component unmounts
    return () => {
      myWorker.terminate();
    };
  }, [loaded, rtrState.loaded]); // Run this effect only once when the component mounts

  const value = { rtrAssets, setRTRAssets };
  return (
    <RTRAssetsContext.Provider value={value}>
      {children}
    </RTRAssetsContext.Provider>
  );
};
