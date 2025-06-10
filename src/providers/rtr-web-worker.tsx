import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import rtr_script from '../workers/rtr';

import { IState, IProviderProps, IRTRService } from '../interfaces';

import { RTRService } from '../services/rtr';
import { setPatch } from '../store/rtr';

const RTRContext = createContext({});

export function useRTRAPI(): any {
  return useContext(RTRContext);
}

export function RTRWorkerProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const { params } = useSelector((state: IState) => state?.fc);

  if (params.timesDebug) {
    console.time('fetchRTR');
  }
  
  const { children } = props;

  const [rtrService, setRTRService] = useState<IRTRService>();

  useEffect(() => {
    if (params.avoidRTR) {
      if (params.fluidEnv) {
        console.log(`RTR: Not loaded by param avoidRTR`);
      }
      return;
    }
    // Create a new web worker
    const myWorker = new Worker(rtr_script);

    // Set up event listener for messages from the worker
    myWorker.onmessage = function (event) {
      if (params.timesDebug) {
        console.timeEnd('fetchRTR');
      }
      const { result, rtrCode } = event.data;
      if (result) {
        console.log({result, rtrCode});
        eval(rtrCode);
        /*console.log(window.rtrViewerMV);
        const _rtrService = new RTRService(window.rtrViewerMV);
        console.log({_rtrService});
        setRTRService(_rtrService);*/

        if (params.fluidEnv) {
          console.log(`RTR: Script loaded`);
        }
        myWorker.terminate();
        return dispatch(setPatch({
          loaded: true,
          loading: false,
          failed: false,
          enabled: true
        }));
      }
      if (params.fluidEnv) {
        console.log(`RTR: Error loading script`);
      }
      const newState = {
        loading: false,
        failed: true,
        loaded: false,
        enabled: false
      };
      myWorker.terminate();
      return dispatch(setPatch(newState));
    };
    myWorker.postMessage(params);

    // Clean up the worker when the component unmounts
    return () => {
      myWorker.terminate();
    };
  }, []); // Run this effect only once when the component mounts

  const value = { rtrService };
  return (
    <RTRContext.Provider value={value}>
      {children}
    </RTRContext.Provider>
  );
};
