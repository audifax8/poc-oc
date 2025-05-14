import React from 'react';
import { memo } from 'react';
import { useDispatch } from 'react-redux';

import { IAttributeValue } from '../../../../interfaces';
import { useLuxAPI } from '../../../../providers/lux-api';
import { updateSelectedAv } from '../../../../store/menu';

import './index.scss';
export interface ISwatchPropTypes {
  av: IAttributeValue;
  caAlias: string | undefined;
  selectedAvId: number | null;
  index?: number;
};

export const Swatch = memo(function (props: ISwatchPropTypes) {
  const dispatch = useDispatch();
  const { luxService } = useLuxAPI();
  const { av, caAlias, selectedAvId, index } = props;

  const imgClasses =
    `fc-swatch-wrapper--img ${av.id === selectedAvId ?
      'fc-swatch-wrapper--img--selected':
      'fc-swatch-wrapper--img--border'}`

  return (
    <>
      {
        <li key={av.id || index}>
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
