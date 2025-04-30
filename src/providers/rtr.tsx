import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RTRService } from '../services/rtr';
import { setScriptLoaded, setEnabled } from '../store/rtr';
import { IProviderProps, IRTRService } from '../interfaces';

const RTRContext = createContext({});

export function useRTR(): any {
  return useContext(RTRContext);
}
export function RTRProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const { children } = props;
  const [rtrService, setRTRService] = useState<IRTRService>();

  useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = '//rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js';
    scriptTag.addEventListener('load', () => {
      const _rtrService = new RTRService(window.rtrViewerMV);
      setRTRService(_rtrService);
      dispatch(setScriptLoaded(true));
      dispatch(setEnabled(true));
    });
    document.body.appendChild(scriptTag);
  },[]);
  
  const value = { rtrService };
  return (
    <RTRContext.Provider value={value}>
      {children}
    </RTRContext.Provider>
  );
}
