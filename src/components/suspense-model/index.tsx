import React, { useState, Suspense, useEffect, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isMobile } from 'react-device-detect';

import { IState } from '../../interfaces';

import './index.scss';

const ModelSkeleton = () => {
  const skeletonImgPath = `/img/${isMobile ? 'mobilev2' : 'desktopv2'}.png`;
  return (
    <div className='fc-image-wrapper'>
      <img className='' src={skeletonImgPath} alt='product skeleton'/>
    </div>
  );
};

/*
fetch('//rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js')
    .then(() => {
      return <>eee</>
    })
    .catch(() => {
      return <>error</>
    });

*/
const ProductModel = lazy(() =>
  fetch('//rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js')
    .then((data) => {
      return {
        default: () => {
          console.log(data);
          return <></>
        }
      }
    })
);

const Model2 = () => {
  const { loaded } = useSelector((state: IState) => state?.core);
  const promise = new Promise((resolve, reject) => {
    //const { loaded } = useSelector((state: IState) => state?.core);
  });

  useEffect(() => {
      
  }, [loaded]);

  return (
    <section className='fc-model'>
      <Suspense fallback={<ModelSkeleton />}>
        <ProductModel />
      </Suspense>
    </section>
  );
};

export default Model2;