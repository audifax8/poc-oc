import React from 'react';

import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';

import './index.scss';
import { useEffect } from 'react';
import { useConfigure } from '../../providers/core';
import { IState } from '../../interfaces';
//import { useRTR } from '../../providers/rtr';

export function Model() {
  const name = useSelector((state: IState) => state?.product?.name);
  //const name = false;
  const { loaded } = useSelector((state: IState) => state?.rtr);
  const avoidRTR = useSelector((state: IState) => state?.params?.avoidRTR);

  const { coreService } = useConfigure();
  //const { rtrService } = useRTR();

  useEffect(() => {
    if (name && loaded) {
      if (!avoidRTR) {
        const token = coreService.getToken();
        console.log({token});
        //rtrService.init(token);
      }
    }
  },
  [loaded, name]);

  //const old = '/img/sk.png';
  const skeletonImgPath = `/img/${isMobile ? 'mobile' : 'desktop'}.png`;

  return (
    <section className='fc-model'>
      <div
        id='viewer'
        className={`fc-rtr ${((loaded && name) && !avoidRTR) ? 'fc-rtr-on' : ''}`}>
          {!name && !loaded && 
            <div className='fc-image-wrapper fc-skeleton'>
              <img className='fc-skeleton' src={skeletonImgPath}/>
            </div>
          }
          {!name && loaded && 
            <div className='fc-image-wrapper fc-skeleton'>
              <img className='fc-skeleton' src={skeletonImgPath}/>
            </div>
          }
          {name && !loaded &&
            <div className='fc-image-wrapper'>
              <img className='' src={skeletonImgPath}/>
            </div>
          }
          {avoidRTR && 
            <div className='fc-image-wrapper'>
              <img className='' src={skeletonImgPath}/>
            </div>
          }
      </div>
    </section>
  );
}
