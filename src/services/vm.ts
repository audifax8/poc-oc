import { IVMMVService } from '../interfaces';

export class VMMVService implements IVMMVService {
  api: any;
  constructor(api: any) {
    this.api = api;
  }

  async isBrowserSupported(): Promise<boolean> {
    try {
      const isBrowserSupported = await this.api.isBrowserSupported();
      return isBrowserSupported as boolean;
    } catch (e: any) {
      return false;
    }
  }
};