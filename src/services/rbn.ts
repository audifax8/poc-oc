import {
  ICoreService,
  ICAMap,
  ILuxBase,
  IAttributeValue,
  IAVFacet,
  ICAFacet,
  IConfigurableAttribute,
  IFacetFacetValueMap,
  IMenuCA
} from '../interfaces';

import { TOKEN_ALIASES, casToMap } from '../constants/rbn';

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
  
  mapCas(): ICAMap[] {
    const mappedCAs = casToMap.map(
      (ca: ICAMap) => {
        const { alias } = ca;
        try {
          const configurableAttibute = this.coreService.getAttributeByAlias(alias);
          const av = this.coreService.getSelectedAV(alias);
          if (configurableAttibute) {
            return {
              ...ca,
              ca: configurableAttibute,
              id: configurableAttibute.id,
              selectedAvId: av.id,
              selectedAv: av
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

  mapCas2(): IMenuCA[] {
    const mappedCAs = casToMap.map(
      (ca: ICAMap) => {
        const { alias } = ca;
        try {
          const configurableAttibute = this.coreService.getAttributeByAlias(alias);
          const selectableAVs =
            configurableAttibute
              .values
              .filter(av => av.selectable && av.active && av.name !== 'Blank');

          const avsLenght = selectableAVs.length;
          const currentPage = avsLenght > 5 ? 5 : avsLenght;
          const avsToRender = selectableAVs.slice(0, currentPage);
          
          const av = this.coreService.getSelectedAV(alias);
          if (configurableAttibute) {
            return {
              ...ca,
              ca: configurableAttibute,
              id: configurableAttibute.id,
              selectedAvId: av.id,
              selectedAvName: av.name,
              avsLenght,
              open: false,
              currentPage,
              skeleton: false,
              avsToRender
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

  reloadPagination(caAlias: string, currentPage: number, open: boolean): IMenuCA {
    const ITEMS_BY_PAGE = 5;
    const newPage = currentPage + ITEMS_BY_PAGE;
    
    const configurableAttibute = this.coreService.getAttributeByAlias(caAlias);
    const selectableAVs =
      configurableAttibute
        .values
        .filter(av => av.selectable && av.active && av.name !== 'Blank');

    const avsLenght = selectableAVs.length;
    const updatedPage = newPage > avsLenght ? avsLenght : newPage;
    const avsToRender = selectableAVs.slice(0, updatedPage);
    
    const av = this.coreService.getSelectedAV(caAlias);
    return {
      ca: configurableAttibute,
      id: configurableAttibute.id,
      selectedAvId: av.id,
      selectedAvName: av.name,
      avsLenght,
      open,
      currentPage: updatedPage,
      skeleton: false,
      avsToRender
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