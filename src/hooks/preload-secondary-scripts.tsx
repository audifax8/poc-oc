import { useEffect } from 'react';
import { preload, preconnect } from 'react-dom';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces';

export const PreloadSecondaryScripts = () => {
  const { params } = useSelector((state: IState) => state?.fc);
  const { avoidLuxAPI, fluidEnv } = params;
  const { mainScriptsLoaded } = useSelector((state: IState) => state?.ui);

  useEffect(() => {
    if (!mainScriptsLoaded) { return; }
    if (!avoidLuxAPI) {
      if (fluidEnv) {
        console.log('Adding preconnect for VM & RXC APIs');
      }
      preconnect('//vmmv.luxottica.com');
      preconnect('//rtrmv.essilorluxottica.com');
    }

    if (fluidEnv && avoidLuxAPI) {
      console.log('Avoid preloading RXC & VM by avoidLuxAPI param');
    }

    if (!avoidLuxAPI) {
      preload(
        '//vmmv.luxottica.com/v/4.13/index.umd.js',
        { as: 'script', crossOrigin: 'anonymous', fetchPriority: 'low' }
      );
      preload(
        '//rxc.luxottica.com/rxc3/fe/test/v1.1.3/dist/rxc.js',
        { as: 'script', crossOrigin: 'anonymous', fetchPriority: 'low' }
      );
    }
    
  },[mainScriptsLoaded]);

  return <></>
};
