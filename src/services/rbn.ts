import {
  ICoreService,
  ICAMap,
  ILuxBase,
  IAttributeValue,
  ICAFacet,
  IConfigurableAttribute,
  IFacetFacetValueMap,
  IMenuCA,
  IMenuPagination
} from '../interfaces';

import { TOKEN_ALIASES, casToMap } from '../constants/rbn';
const ITEMS_BY_PAGE = 5;

export class RBNService implements ILuxBase {
  coreService: ICoreService;

  constructor(core: ICoreService) {
    this.coreService = core;
    /*this.coreService.on('recipe:change', (c: any, c1: any, c2: any) => {
      const token = this.getToken();
    });*/
  }

  getToken(): string {
    const skipServices = true;
    const recipe = this.coreService.getRecipe('custom', 'alias', 'vendorId');
    const productVendorId = this.coreService.getProduct().vendorId;
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
      const selectedLensesSku = this.coreService.getAttributeByAlias('lenses_sku').values.filter((value: any) => value.selected)[0];
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

  decodeToken(): any[] {
    return [];
  };

  getFacetsValuesByAv(av:IAttributeValue, ca: IConfigurableAttribute): IFacetFacetValueMap [] {
    const { facets } = av;
    const { allFacets } = ca;
    if (!facets || !allFacets) { return []; }

    const facetFacetValuesMapped: IFacetFacetValueMap[] = [];

    Object.keys(facets).forEach((key: string) => {
      const avFacetId = parseInt(key, 10);
      const avFacetIds = facets[key];
      const facet = allFacets.find((facet: ICAFacet) => facet.id === avFacetId);
      const facetValues = facet?.facetValues.find((fv) => avFacetIds.includes(fv.id));
      const facetFacetValueMap: IFacetFacetValueMap = {
        id: facet?.id,
        name: facet?.name,
        facetValuesMapped: facetValues
      };
      facetFacetValuesMapped.push(facetFacetValueMap);
    });
    return facetFacetValuesMapped;
  }

  getSwatchURL(av: IAttributeValue, caName: string): string {
    const ca = this.coreService.getAttributeByAlias(caName);
    const facetFacetValuesMapped = this.getFacetsValuesByAv(av, ca);
    const colorCode = facetFacetValuesMapped.find(f => f.name === 'Color Code');
    if (colorCode) {
      const { facetValuesMapped } = colorCode;
      return `//cdn-prod.fluidconfigure.com/static/fluid-implementation-lux.s3.amazonaws.com/ray-ban/color_code_swatches/swatch_${facetValuesMapped?.name}.png`;
    }
    return '';
  };

  getProductImg(isMobile: boolean): string {
    const conciseRecipe = this.coreService.getRecipe('legacyConcise');
    const uriRecipe = encodeURI(conciseRecipe);
    const { id, defaultViewName, environment, workflow, customerId } = this.coreService.getProduct();
    const format = 'png';
    const quality = '50';
    const sacale = isMobile ? '0.2' : '0.5';
    const baseURL =
      `//prod.fluidconfigure.com/imagecomposer/generate/?view=${defaultViewName}&apiKey=LUX-Ray-Ban-8taOhSR5AFyjt9tfxU&workflow=${workflow}&environment=${environment}&customerId=${customerId}&productId=${id}&purpose=serverDisplay&format=${format}&trim=false&padding=0&scale=${sacale}&binary=true&quality=${quality}&backgroundColor=%23f6f6f6ff&recipe=${uriRecipe}`;
    return baseURL;
  };

  getAVsToRenderByCA(caAlias: string): IAttributeValue[] {
    try {
      const configurableAttibute = this.coreService.getAttributeByAlias(caAlias);
      return configurableAttibute.values
        .filter(av => av.selectable && av.active && av.name !== 'Blank');
    } catch (e) {
      return [];
    }
  };

  getPaginatedAVsToRenderByCA(caAlias: string, limit: number): IMenuPagination {
    try {
      const selectableAVs = this.getAVsToRenderByCA(caAlias);
      const avsLenght = selectableAVs.length;
      const currentPage = avsLenght > limit ? limit : avsLenght;
      const limitedAVs = selectableAVs.slice(0, currentPage);
      return {
        avs: limitedAVs,
        currentPage,
        avsLenght
      };
    } catch (e) {
      return {
        avs: [],
        currentPage: 0,
        avsLenght: 0
      };
    }
  };

  mapCas(): IMenuCA[] {
    const mappedCAs = casToMap.map(
      (ca: ICAMap) => {
        const { alias } = ca;
        try {
          const configurableAttibute = this.coreService.getAttributeByAlias(alias);
          const { avs, currentPage, avsLenght} =
            this.getPaginatedAVsToRenderByCA(alias, ITEMS_BY_PAGE);
          
          const av = this.coreService.getSelectedAV(alias);
          if (configurableAttibute) {
            return {
              caName: configurableAttibute.name,
              alias: configurableAttibute.alias,
              id: configurableAttibute.id,
              avs,
              selectedAvId: av.id,
              selectedAvName: av.name,
              avsLenght,
              open: false,
              currentPage,
              skeleton: false,
              icon: ca.icon
            };
          }
        } catch (e) {
          return undefined;
        }
      }
    ) as IMenuCA[];
    const sanitizedCas = mappedCAs.filter((ca: ICAMap) => ca);
    return sanitizedCas;
  };

  reloadPagination(alias: string, page: number, open: boolean): IMenuCA {
    const newPage = page + ITEMS_BY_PAGE;

    const configurableAttibute = this.coreService.getAttributeByAlias(alias);
    const { avs, currentPage, avsLenght} = this.getPaginatedAVsToRenderByCA(alias, newPage);    
    const av = this.coreService.getSelectedAV(alias);
    return {
      id: configurableAttibute.id,
      alias: configurableAttibute.alias,
      caName: configurableAttibute.name,
      selectedAvId: av.id,
      selectedAvName: av.name,
      avsLenght,
      open,
      currentPage,
      skeleton: false,
      avs
    } as IMenuCA;      
  };

  setRecipe(changes: any[]) {
    return new Promise((resolve, reject) => {
      return this.coreService.setRecipe(changes, (e: any, c: any) => {
        if (e) {
          return reject(e);
        }
        return resolve(c);
      });
    });
  }
};