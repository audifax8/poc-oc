import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { useRTR } from '../../providers/rtr';
import { setOn } from '../../store/rtr';

import { IState } from '../../interfaces';

import './index.scss';

export function Model() {
  const dispatch = useDispatch();
  const { rtrService } = useRTR();
  const { loaded, on, modelAssetsPreloaded, camera } = useSelector((state: IState) => state?.rtr);
  const { params: { avoidRTR} } = useSelector((state: IState) => state?.fc);
  const { name } = useSelector((state: IState) => state?.product);
  const { token } = useSelector((state: IState) => state?.ui);

  useEffect(() => {
    if (rtrService && loaded && modelAssetsPreloaded && !on && !avoidRTR) {
      rtrService.init(token);
      dispatch(setOn(true));
    }
    if (rtrService && loaded && modelAssetsPreloaded && on && !avoidRTR) {
      const isValidToken = rtrService.isIdAvailable(token);
      if (isValidToken) {
        rtrService.setId(token);
      }
      if (camera) {
        const componentToToken = rtrService.mapCameraNameRTRToComponent(camera);
        rtrService.selectComponent(componentToToken);
      }
    }
  },
  [token, avoidRTR, modelAssetsPreloaded, camera, loaded]);

  const skeletonImgPath = `/img/${isMobile ? 'mobilev2w' : 'desktopv2w'}.webp`;

  return (
    <section className='fc-model'>
      <div
        id='viewer'
        className={`fc-rtr ${((loaded && name) && !avoidRTR) ? 'fc-rtr-on' : ''}`}>
          {(avoidRTR && name) &&
            <div className='fc-image-wrapper'>
              <img className='' src={skeletonImgPath} alt='product skeleton'/>
            </div>
          }
      </div>
    </section>
  );
};

/*

{(!modelAssetsPreloaded && !loaded) && (avoidRTR && name) &&
            <div className='fc-image-wrapper'>
              <img className='' src={skeletonImgPath} alt='product skeleton'/>
            </div>
          }

*/

