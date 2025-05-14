import React from 'react';
import { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IAttributeValue } from '../../../../interfaces';
import { useLuxAPI } from '../../../../providers/lux-api';
import { updateSelectedAv } from '../../../../store/menu';

import './index.scss';
export interface ISwatchPropTypes {
  av: IAttributeValue;
  caAlias: string | undefined;
};

export const Swatch = memo(function (props: ISwatchPropTypes) {
  const dispatch = useDispatch();
  const { luxService } = useLuxAPI();
  const { av, caAlias } = props;
  //TODO
  //const [selected, setSelected] = useState(false);

  const imgClasses =
    `fc-swatch-wrapper--img ${av.selected ?
      'fc-swatch-wrapper--img--selected':
      'fc-swatch-wrapper--img--border'}`

  return (
    <>
      {
        <li key={av.id}>
          <button
            type='button'
            className='fc-swatch'
            onClick={() => dispatch(updateSelectedAv({ avId: av.id, caAlias }))}
          >
            <div className='fc-swatch-wrapper'>
              <div className={imgClasses}>
                <img src={luxService.getSwatchURL(av, caAlias)} alt={av.name}></img>
                </div>
              <div className='fc-swatch-wrapper--name'>
                <span>{av?.name}</span>
              </div>
            </div>
          </button>
        </li>
      }
    </>
  );
});
