import { useEffect } from 'react';
import { preload, preconnect } from 'react-dom';
import { useSelector } from 'react-redux';
import { IState } from '../interfaces';

export const PreloadMainScripts = () => {
  const { params } = useSelector((state: IState) => state?.fc);
  const product = useSelector((state: IState) => state?.product);
  const { vendorId, currency } = product;

  useEffect(() => {
    preconnect('https://cdn-prod.fluidconfigure.com');
    preconnect('https://prod.fluidconfigure.com');
    const { workflow, product, customer, locale, fluidEnv, avoidRTR } = params;
  
    const graphUrl =
      `https://cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/graph-settings-${locale}.json`;
    const preferencesUrl =
      `https://cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/preferences.json`;
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

    if (avoidRTR) {
      if (fluidEnv) {
        console.log('Avoid preloading RTR by avoidRTR param');
      }
    }

    if (!avoidRTR) {
      preload(
        'https://rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js',
        { as: 'script', crossOrigin: 'anonymous', fetchPriority: 'high' }
      );
    }
    if (vendorId && currency) {
      preload(`https://one-configurator-services-mockup.luxdeepblue.com/components?vendorId=${vendorId}&currency=${currency}`, {as: 'fetch', crossOrigin: 'anonymous'});
    }
    
  },[]);

  return <></>
};
