import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IProviderProps, IState, IVMMVService } from '../interfaces';
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
  const { params: { avoidLuxAPI, fluidEnv } } = useSelector((state: IState) => state?.fc);
  const { mainScriptsLoaded } = useSelector((state: IState) => state?.ui);

  useEffect(() => {
    if (!mainScriptsLoaded) { return; }
    if (avoidLuxAPI !== undefined) {
      if (avoidLuxAPI === true) {
        if (fluidEnv) {
          console.log(`VM: Not loaded by param avoidLuxAPI`);
        }
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
    scriptTag.src = '//vmmv.luxottica.com/v/4.13/index.umd.js';
    scriptTag.async = true;
    scriptTag.addEventListener('load', () => {
      if (!window.vmmv) {
        if (fluidEnv) {
          console.log(`VM: Error loading script`);
        }
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
        console.log(`VM: script loaded`);
      }
      const newState = {
        loading: false,
        failed: false,
        loaded: true,
        enabled: true
      };
      dispatch(setPatch(newState));
      const _vmService = new VMMVService(window.vmmv);
      setVmService(_vmService);
    });
    scriptTag.addEventListener('error', (e: any) => {
      if (fluidEnv) {
        console.log(`VM: Error loading script`);
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
  },[mainScriptsLoaded]);
  
  const value = { vmService, setVmService };
  return (
    <VMContext.Provider value={value}>
      {children}
    </VMContext.Provider>
  );
}
