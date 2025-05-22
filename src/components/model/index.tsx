import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { useRTR } from '../../providers/rtr';
import { useLuxAPI } from '../../providers/lux-api';
import { setOn } from '../../store/rtr';

import { IState } from '../../interfaces';

import './index.scss';

export function Model() {
  const dispatch = useDispatch();
  const { rtrService } = useRTR();
  const { luxService } = useLuxAPI();
  const { loaded, on, modelAssetsPreloaded, camera } = useSelector((state: IState) => state?.rtr);
  const { params: { avoidRTR, fluidEnv, rtrTimeOut, rtrLoader, showBackgroundImg } } = useSelector((state: IState) => state?.fc);
  const { name } = useSelector((state: IState) => state?.product);
  const { token } = useSelector((state: IState) => state?.ui);
  const [isImageLoaded, setIsImageLoaded] = useState('');
  const [rtrReady, setRTRReady] = useState(false);

  useEffect(() => {
    if (luxService && avoidRTR && name) {
      const url = luxService.getProductImg(isMobile);
      fetch(url)
        .then(() => setIsImageLoaded(url))
        .catch((e) => {
          if (fluidEnv) {
            console.log({e});
          }
        });
    }
    if (rtrService && loaded && modelAssetsPreloaded && !on && !avoidRTR) {
      rtrService.init(token);
      dispatch(setOn(true));
      if (!rtrLoader) { setRTRReady(true); }
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
    if (!avoidRTR) {
      if (rtrLoader) {
        //TODO avoid timeout
        setTimeout(() => setRTRReady(true), rtrTimeOut);
      }
    }
  },
  [token, avoidRTR, modelAssetsPreloaded, camera, loaded]);

  const imgClasses = `fc-rtr ${((loaded && name) && !avoidRTR) ? 'fc-rtr-on' : ''}`;
  const lcpClasses = `fc-lcp ${showBackgroundImg ? '' : 'fc-lcp-backgroung'}`;
  const skeletonImgPath = `/img/sk.webp`;

  return (
    <section className='fc-model'>
      <div
        id='viewer'
        className={imgClasses}>
      </div>
      {!rtrReady &&
        <div
        id='viewer2'
        className={lcpClasses}>
          <div className='fc-image-wrapper'>
            {
              <img
                className=''
                src={isImageLoaded ? isImageLoaded : skeletonImgPath}
                alt='product skeleton'
                fetchPriority='high'
              />
            }
          </div>
        </div>
      }
    </section>
  );
};
//className={`${isImageLoaded ? '' : 'fc-skeleton'}`}