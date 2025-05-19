import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RTRService } from '../services/rtr';
import { setPatch } from '../store/rtr';
import { IProviderProps, IRTRService, IState } from '../interfaces';
import { RTR_ASSETS } from '../models/rtr-assets';

const RTRContext = createContext({});

export function useRTR(): any {
  return useContext(RTRContext);
}
export function RTRProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const { children } = props;
  const [rtrService, setRTRService] = useState<IRTRService>();
  const [rtrAssets, setRTRAssets] = useState<RTR_ASSETS>();
  const { params: { avoidLuxAPI, fluidEnv } } = useSelector((state: IState) => state?.fc);

  useEffect(() => {
    if (avoidLuxAPI !== undefined) {
      if (avoidLuxAPI === true && fluidEnv) {
        console.log(`RTR: Not loaded by param avoidLuxAPI`);
        dispatch(setPatch({
          loaded: false,
          loading: false,
          failed: false,
          enabled: false
        }));
        return;
      }
    }
    const scriptTag = document.createElement('script');
    scriptTag.src = '//rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js';
    scriptTag.addEventListener('load', () => {
      if (!window.rtrViewerMV && fluidEnv) {
        console.log(`RTR: Error loading script`);
        const newState = {
          loading: false,
          failed: true,
          loaded: false,
          enabled: false
        };
        dispatch(setPatch(newState));
        return;
      }
      if (fluidEnv) {
        console.log(`RTR: Script loaded`);
      }
      const _rtrService = new RTRService(window.rtrViewerMV);
      setRTRService(_rtrService);
      dispatch(setPatch({
        loaded: true,
        loading: false,
        failed: false,
        enabled: true
      }));
      return;
    });
    scriptTag.addEventListener('error', (e) => {
      if (fluidEnv) {
        console.log(`RTR: Error loading script`);
        console.log(e);
      }
      dispatch(setPatch({
        loaded: false,
        loading: false,
        failed: true,
        enabled: false
      }));
      return;
    });
    document.body.appendChild(scriptTag);
  },[avoidLuxAPI]);
  
  const value = { rtrService, rtrAssets, setRTRAssets };
  return (
    <RTRContext.Provider value={value}>
      {children}
    </RTRContext.Provider>
  );
}
