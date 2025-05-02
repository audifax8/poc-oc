import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IProviderProps, IRXCService } from '../interfaces';
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

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = '//rxc.luxottica.com/rxc3/fe/test/v1.1.4/dist/rxc.js';
    scriptTag.addEventListener('load', () => {
      if (window.RXC && window.RXC_LOADED) {
        console.log(`RXC: script loaded`);
        const newState = {
          loading: false,
          failed: false,
          loaded: true,
          enabled: true
        };
        dispatch(setPatch(newState));
        const _rxcService = new RXCService(window.RXC);
        setRxcService(_rxcService);
      } else {
        console.log(`RXC: Error loading script`);
        const newState = {
          loading: false,
          failed: true,
          loaded: false,
          enabled: false
        };
        dispatch(setPatch(newState));
      }
    });
    scriptTag.addEventListener('error', (e: any) => {
      console.log(`RXC: Error loading script`);
      console.log(e);
      const newState = {
        loading: false,
        failed: true,
        loaded: false,
        enabled: false
      };
      dispatch(setPatch(newState));
    });
    document.body.appendChild(scriptTag);
  },[]);
  
  const value = { rxcService };
  return (
    <RXCContext.Provider value={value}>
      {children}
    </RXCContext.Provider>
  );
}
