import { useEffect } from 'react';
import { preload, preconnect } from 'react-dom';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { IState } from '../interfaces';

export const PreloadScripts = () => {
  const { params } = useSelector((state: IState) => state?.fc);
  const product = useSelector((state: IState) => state?.product);
  const [queryParameters] = useSearchParams();
  const queryWorkflow = queryParameters?.get('workflow');
  const queryCustomer = queryParameters?.get('customer');
  const queryProduct = queryParameters?.get('product');
  const queryAvoidLuxApi = queryParameters?.get('avoidLuxAPI');
  const queryFluidEnv = queryParameters?.get('fluidEnv');

  const mergedParams = {
    ...params,
    workflow: queryWorkflow || params.workflow,
    customer: queryCustomer || params.customer,
    customerId: queryCustomer || params.customer,
    product: queryProduct || params.product,
    productId: queryProduct || params.product,
    locale: queryProduct || params.locale,
    avoidLuxAPI: queryAvoidLuxApi === 'true' ? true: false || params.avoidLuxAPI,
    fluidEnv: queryFluidEnv === 'true' ? true: false || params.fluidEnv,
    queryFluidEnv
  };

  const { vendorId, currency } = product;

  useEffect(() => {
    preconnect('//cdn-prod.fluidconfigure.com');
    const { workflow, product, customer, locale, avoidLuxAPI, fluidEnv } = mergedParams;
    const graphUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/graph-settings-${locale}.json`;
    const preferencesUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/preferences.json`;
    /*const uiSettings =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/ui-settings-${locale}.json`;*/

    preload(graphUrl, {as: 'fetch', crossOrigin: 'anonymous'});
    preload(preferencesUrl, {as: 'fetch', crossOrigin: 'anonymous'});
    //preload(uiSettings, {as: 'fetch', crossOrigin: 'anonymous'});

    if (fluidEnv && avoidLuxAPI) {
      console.log('Avoid preloading RTR, RXC & VM by avoidLuxAPI param');
    }

    if (!avoidLuxAPI) {
      preload('//rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js', {as: 'script', crossOrigin: 'anonymous'});
      preload('//vmmv.luxottica.com/v/4.13/index.umd.js', {as: 'script', crossOrigin: 'anonymous'});
      preload('//rxc.luxottica.com/rxc3/fe/test/v1.1.3/dist/rxc.js', {as: 'script', crossOrigin: 'anonymous'});
    }
    if (vendorId && currency) {
      preload(`//one-configurator-services-mockup.luxdeepblue.com/components?vendorId=${vendorId}&currency=${currency}`, {as: 'fetch', crossOrigin: 'anonymous'});
    }
    
  },[]);

  return <></>
};
