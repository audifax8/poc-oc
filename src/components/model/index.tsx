import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { useEffect } from 'react';
import { useLuxAPI } from '../../providers/lux-api';
import { IState } from '../../interfaces';
import { useRTR } from '../../providers/rtr';
import { setOn } from '../../store/rtr';
import { updateToken } from '../../store/ui';

import './index.scss';

export function Model() {
  const dispatch = useDispatch();
  const name = useSelector((state: IState) => state?.product?.name);
  const { loaded, on } = useSelector((state: IState) => state?.rtr);
  const { token } = useSelector((state: IState) => state?.ui);
  const avoidRTR = useSelector((state: IState) => state?.params?.avoidRTR);

  const { luxService } = useLuxAPI();
  const { rtrService } = useRTR();

  useEffect(() => {
    let newToken;
    if (luxService) {
      newToken = luxService.getToken();
      dispatch(updateToken(newToken));
    }

    if (name && loaded && luxService && !on) {
      if (!avoidRTR && rtrService) {
        rtrService.init(newToken);
        dispatch(setOn(true));
      }
    }

    if (on && token !== null) {
      const isValidToken = rtrService.isIdAvailable(token);
      if (isValidToken) {
        rtrService.setId(token);
      }
    }
  },
  [loaded, name, token]);

  //const skeletonImgPath = `/img/${isMobile ? 'mobile' : 'desktop'}.png`;

  return (
    <section className='fc-model'>
      <div
        id='viewer'
        className={`fc-rtr ${((loaded && name) && !avoidRTR) ? 'fc-rtr-on' : ''}`}>
          {!name && !loaded && 
            <div className='fc-image-wrapper fc-skeleton'>
              <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg>
            </div>
          }
          {!name && loaded && 
            <div className='fc-image-wrapper fc-skeleton'>
              <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg>
            </div>
          }
          {name && !loaded &&
            <div className='fc-image-wrapper'>
              <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg>
            </div>
          }
          {avoidRTR && 
            <div className='fc-image-wrapper'>
              <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg>
            </div>
          }
      </div>
    </section>
  );
};

/*
{avoidRTR && 
            <div className='fc-image-wrapper'>
              <img className='' src={skeletonImgPath}/>
            </div>
          }

*/
