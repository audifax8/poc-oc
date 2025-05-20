import { useEffect } from 'react';
import { preload, preconnect } from 'react-dom';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces';

export const PreloadScripts = () => {
  const { params } = useSelector((state: IState) => state?.fc);
  const product = useSelector((state: IState) => state?.product);

  const { vendorId, currency } = product;

  useEffect(() => {
    preconnect('//cdn-prod.fluidconfigure.com');
    preconnect('//prod.fluidconfigure.com');
    const { workflow, product, customer, locale, avoidLuxAPI, fluidEnv } = params;
    if (!avoidLuxAPI) {
      if (fluidEnv) {
        console.log('Adding preconnect for Luxottica APIs');
      }
      preconnect('//vmmv.luxottica.com');
      preconnect('//rtrmv.essilorluxottica.com');
    }
    const graphUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/graph-settings-${locale}.json`;
    const preferencesUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/preferences.json`;
    /*const uiSettings =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/ui-settings-${locale}.json`;*/

    preload(
      graphUrl,
      { as: 'fetch', crossOrigin: 'anonymous', fetchPriority: 'high' }
    );
    preload(
      preferencesUrl,
      { as: 'fetch', crossOrigin: 'anonymous', fetchPriority: 'high' }
    );
    //preload(uiSettings, {as: 'fetch', crossOrigin: 'anonymous'});

    if (fluidEnv && avoidLuxAPI) {
      console.log('Avoid preloading RTR, RXC & VM by avoidLuxAPI param');
    }

    if (!avoidLuxAPI) {
      preload(
        '//rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js',
        { as: 'script', crossOrigin: 'anonymous', fetchPriority: 'high' }
      );
      preload(
        '//vmmv.luxottica.com/v/4.13/index.umd.js',
        { as: 'script', crossOrigin: 'anonymous', fetchPriority: 'low' }
      );
      preload(
        '//rxc.luxottica.com/rxc3/fe/test/v1.1.3/dist/rxc.js',
        { as: 'script', crossOrigin: 'anonymous', fetchPriority: 'low' }
      );
    }
    if (vendorId && currency) {
      preload(`//one-configurator-services-mockup.luxdeepblue.com/components?vendorId=${vendorId}&currency=${currency}`, {as: 'fetch', crossOrigin: 'anonymous'});
    }
    
  },[]);

  return <></>
};
