import React from 'react';
import { useEffect, createContext, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoaded } from '../store/core';
import { CoreService } from '../services/core';
import { setProduct } from '../store/product';
import { useSearchParams } from 'react-router-dom';
import { setParams } from '../store/params';
import { setCASToRender } from '../store/ui';
import { IState, ICoreService, IProviderProps } from '../interfaces';
import { RBNService } from '../services/rbn';

const createCore = require('@cfg.plat/configure-core');

const CoreContext = createContext({});

export function useConfigure(): any {
  return useContext(CoreContext);
}

export function CoreProvider(props: IProviderProps) {
  const dispatch = useDispatch();
  const params = useSelector((state: IState) => state?.params);
  const [queryParameters] = useSearchParams();
  const queryWorkflow = queryParameters?.get('workflow');
  const queryCustomer = queryParameters?.get('customer');
  const queryProduct = queryParameters?.get('product');
  const avoidRTR = queryParameters?.get('avoidRTR');
  const queryBrand = queryParameters?.get('brand');
  const mergedParams = {
    ...params,
    workflow: queryWorkflow || params.workflow,
    customer: queryCustomer || params.customer,
    customerId: queryCustomer || params.customer,
    product: queryProduct || params.product,
    productId: queryProduct || params.product,
    brand: queryBrand || params.brand,
    avoidRTR
  };

  const { children } = props;
  const [coreService, setCoreService] = useState<ICoreService>();
  useEffect(() => {
    const { workflow, product, customer, locale, brand } = mergedParams;
    const graphUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/graph-settings-${locale}.json`;
    const preferencesUrl =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/preferences.json`;
    const uiSettings =
      `//cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/ui-settings-${locale}.json`;

    Promise.all([
      fetch(graphUrl),
      fetch(preferencesUrl),
      fetch(uiSettings)
    ])
    .then(async (
      [
        productGraphResponse,
        preferencesResponse,
        uiSettingsResponse
      ]
    ) => {
      if (productGraphResponse.ok && preferencesResponse.ok && uiSettingsResponse.ok) {
        const productGraph = await productGraphResponse.json();
        const preferences = await preferencesResponse.json();
        const uiSettings = await uiSettingsResponse.json();

        createCore(
          {
            productGraph,
            preferences,
            ...mergedParams,
          },
          (error: any, configureCore: any) => {
            if (error) {
              console.error(error);
              return;
            }
            const _cService = new CoreService(configureCore);
            const _rbnService = new RBNService(configureCore);
            const product = _cService.getProduct();
            dispatch(setLoaded(true));
            dispatch(setProduct(product));
            dispatch(setParams(mergedParams));
            const casToRender = _rbnService.mapCas();
            dispatch(setCASToRender(casToRender));
            setCoreService(_cService);
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });

  },[]);
  const value = { coreService };
  return (
    <CoreContext.Provider value={value}>
      {children}
    </CoreContext.Provider>
  );
};
