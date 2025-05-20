import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { useRTR } from '../../providers/rtr';
import { setOn } from '../../store/rtr';

import { IState } from '../../interfaces';

import './index.scss';
import { useLuxAPI } from '../../providers/lux-api';

export function Model() {
  const dispatch = useDispatch();
  const { rtrService } = useRTR();
  const { luxService } = useLuxAPI();
  const { loaded, on, modelAssetsPreloaded, camera } = useSelector((state: IState) => state?.rtr);
  const { params: { avoidRTR, fluidEnv } } = useSelector((state: IState) => state?.fc);
  const { name } = useSelector((state: IState) => state?.product);
  const { token } = useSelector((state: IState) => state?.ui);
  const [isImageLoaded, setIsImageLoaded] = useState('');

  useEffect(() => {
    if (luxService && avoidRTR) {
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
              {
                <img
                  className=''
                  src={isImageLoaded ? isImageLoaded : skeletonImgPath}
                  alt='product skeleton'
                  fetchPriority='high'
                />
              }
            </div>
          }
      </div>
    </section>
  );
};

//src={name ? luxService.getProductImg(isMobile) : skeletonImgPath}