import {
  ICoreService,
  IProduct,
  IConfigurableAttribute,
  IAttributeValue
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
}