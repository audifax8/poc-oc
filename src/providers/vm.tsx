import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IProviderProps, IVMMVService } from '../interfaces';
import { VMMVService } from '../services/vm';
import { setPatch } from '../store/vm';

const VMContext = createContext({});

export function useVM(): any {
  return useContext(VMContext);
}
export function VMProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const { children } = props;
  const [vmService, setVmService] = useState<IVMMVService>();

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = '//vmmv.luxottica.com/v/4.13/index.umd.js';
    scriptTag.addEventListener('load', () => {
      if (window.vmmv) {
        console.log(`VM: script loaded`);
        const newState = {
          loading: false,
          failed: false,
          loaded: true,
          enabled: true
        };
        dispatch(setPatch(newState));
        const _vmService = new VMMVService(window.vmmv);
        setVmService(_vmService);
      }
    });
    scriptTag.addEventListener('error', (e: any) => {
      console.log(`VM: Error loading script`);
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
  
  const value = { vmService, setVmService };
  return (
    <VMContext.Provider value={value}>
      {children}
    </VMContext.Provider>
  );
}
