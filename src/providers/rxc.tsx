import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IProviderProps, IRXCService, IState } from '../interfaces';
import { RXCService } from '../services/rxc';
import { setPatch } from '../store/rxc';

const RXCContext = createContext({});

export function useRXC(): any {
  return useContext(RXCContext);
}
export function RXCProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const { children } = props;
  const [rxcService, setRxcService] = useState<IRXCService>();
  const { params: { avoidLuxAPI, fluidEnv } } = useSelector((state: IState) => state?.fc);

  useEffect(() => {
    if (avoidLuxAPI !== undefined) {
      if (avoidLuxAPI === true && fluidEnv) {
        console.log(`RXC: Not loaded by param avoidLuxAPI`);
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
    scriptTag.src = '//rxc.luxottica.com/rxc3/fe/test/v1.1.4/dist/rxc.js';
    scriptTag.addEventListener('load', () => {
      if (!window.RXC_LOADED && fluidEnv) {
        console.log(`RXC: Error loading script`);
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
        console.log(`RXC: script loaded`);
      }
      const newState = {
        loading: false,
        failed: false,
        loaded: true,
        enabled: true
      };
      dispatch(setPatch(newState));
      return;
    });
    scriptTag.addEventListener('error', (e: any) => {
      if (fluidEnv) {
        console.log(`RXC: Error loading script`);
        console.log(e);
      }
      const newState = {
        loading: false,
        failed: true,
        loaded: false,
        enabled: false
      };
      dispatch(setPatch(newState));
    });
    document.body.appendChild(scriptTag);
  },[avoidLuxAPI]);
  
  const value = { rxcService };
  return (
    <RXCContext.Provider value={value}>
      {children}
    </RXCContext.Provider>
  );
}
