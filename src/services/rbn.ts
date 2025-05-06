import {
  ICoreService,
  ICAMap,
  ILuxBase,
  IAttributeValue,
  IAVFacet,
  ICAFacet,
  IConfigurableAttribute,
  IFacetFacetValueMap
} from '../interfaces';

import { TOKEN_ALIASES, casToMap } from '../constants/rbn';

export class RBNService implements ILuxBase {
  coreService: ICoreService;

  constructor(core: ICoreService) {
    this.coreService = core;
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
};