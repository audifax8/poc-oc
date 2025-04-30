import { IRTRService } from '../interfaces';

export class RTRService implements IRTRService {
  /* Lux rtr API */
  api: any;
  constructor(api: any) {
    this.api = api;
  }

  getVersion(): any {
    return this.api.getVersion();
  }

  init(token: string): void {
    const initData = {
      data: {
        settings: {
          env: 'PROD',
          orbitPoint: false,
          highlightComponent: true,
          overviewVisibility: false,
          displayComponentPointer: true,
          automaticFramingComponent: true,
          buttonsVisibility: {
            tutorial: 'hidden',
            explosion: 'overlay',
            accessibility: 'overlay',
            animationAtLanding: 'overlay'
          }
        },
        id: {
          type: 'token',
          value: token
        },
        locale: 'en-US', // or any other available locale
        selector: '#viewer'
      },
      metadata: {
        envs: {
          asset: 'production',
          catalog: 'production',
          ms: 'production',
        },
        qa: false
      },
      callbacks: {
        onComponentSelected: () => {
        },
        onActions: () => {
          // one of the possible actions is "click" that will contains the
          // selected component slot in the token. When the user clicks on a
          // configurable part, then the camera frames the clicked component
          // provided that highlightComponentPart has been set to true
        }
      }
    };
    this.api.init(initData);
  }
}
