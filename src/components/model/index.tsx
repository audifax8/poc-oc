import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { useEffect } from 'react';
import { useLuxAPI } from '../../providers/lux-api';
import { IState } from '../../interfaces';
import { useRTR } from '../../providers/rtr';

import './index.scss';
import { setOn } from '../../store/rtr';

export function Model() {
  const dispatch = useDispatch();
  const name = useSelector((state: IState) => state?.product?.name);
  const { loaded } = useSelector((state: IState) => state?.rtr);
  const avoidRTR = useSelector((state: IState) => state?.params?.avoidRTR);

  const { luxService } = useLuxAPI();
  const { rtrService } = useRTR();

  useEffect(() => {  
    if (name && loaded && luxService) {
      if (!avoidRTR && rtrService) {
        const token = luxService.getToken();
        rtrService.init(token);
        dispatch(setOn(true));
      }
    }
  },
  [loaded, name]);

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
};
