import {
  ICoreService,
  IProduct,
  IConfigurableAttribute,
  IAttributeValue,
  ICAMap
} from '../interfaces';

export class CoreService implements ICoreService {
  configure: ICoreService;
  constructor(configure: any) {
    this.configure = configure;
  }
  
  getProduct(): IProduct {
    return this.configure.getProduct();
  };

  getProductName(): string {
    return this.getProduct().name;
  };

  getAttributeByAlias(alias: string): IConfigurableAttribute {
    return this.configure.getAttribute({ alias });
  };

  getRecipe(format: string, option1?: string, option2?: string): any {
    return this.configure.getRecipe(format, option1, option2);
  };

  getAttribute(options: any): IConfigurableAttribute {
    return this.configure.getAttribute(options);
  }

  getSelectedAV(alias: string): IAttributeValue {
    const ca = this.getAttribute({ alias });
    return ca.values.find((av: IAttributeValue) => av.selected) as IAttributeValue;
  };

  getToken(): string {
    const skipServices = true;
    const TOKEN_ALIASES = [
      'frame_sku',
      'temple_sku',
      'temple_tips_sku',
      'lenses_sku',
      'metal_sku',
      'size',
      'service_1',
      'service_2',
      'service_3'
    ];
    const recipe = this.configure.getRecipe('custom', 'alias', 'vendorId');
    const productVendorId = this.getProduct().vendorId;
    let tokenArray = TOKEN_ALIASES.map(alias => {
      if (alias.indexOf('service') > -1) {
        return '';
      } else {
        return recipe[alias] ? recipe[alias].replace(/\s/g, '.') : 'NULL';
      }
    });
    tokenArray = tokenArray.filter(el => {
      if (el) {
        return el;
      }
    });
    if (!skipServices) {
      const selectedLensesSku = this.getAttributeByAlias('lenses_sku').values.filter((value: any) => value.selected)[0];
      if (selectedLensesSku.metadata) {
        const services: any [] = [];
        selectedLensesSku.metadata.map((data: any) => {
          if (data.key.indexOf('Service') > -1) {
            const order = data.key.match(/[0-9]/);
            services[order[0]] = data.value;
          }
        });
        services.map(service => tokenArray.push(service));
      }
    }
    const token = ['TKN', productVendorId.toUpperCase()].concat(tokenArray).join('~');
    return encodeURIComponent(token);
  };

  mapCas(): ICAMap[] {
    const casToMap: ICAMap[] = [
      {
        id: null,
        alias: 'frame_sku',
        icon: 'frame',
        selectedAvId: null
      },
      {
        id: null,
        alias: 'lenses_sku',
        icon: 'lens',
        selectedAvId: null
      },    
      {
        id: null,
        alias: 'temple_tips_sku',
        icon: 'temple',
        selectedAvId: null
      },
      {
        id: null,
        alias: '',
        icon: 'temple',
        selectedAvId: null
      }
    ];

    const mappedCAs = casToMap.map(
      (ca: ICAMap) => {
        const { alias } = ca;
        try {
          const configurableAttibute = this.getAttributeByAlias(alias);
          const av = this.getSelectedAV(alias);
          if (configurableAttibute) {
            return {
              ...ca,
              id: configurableAttibute.id,
              selectedAvId: av.id
            };
          }
        } catch (e) {
          return undefined;
        }
      }
    ) as ICAMap[];
    const sanitizedCas = mappedCAs.filter((ca: ICAMap) => ca);
    return sanitizedCas;
  };
}