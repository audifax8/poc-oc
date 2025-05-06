import React from 'react';
import { useState, memo } from 'react';

import './index.scss';
import { IAttributeValue } from '../../../../interfaces';
import { useLuxAPI } from '../../../../providers/lux-api';

export interface ISwatchPropTypes {
  av: IAttributeValue;
  caAlias: string | undefined;
};

export const Swatch = memo(function (props: ISwatchPropTypes) {
  const { luxService } = useLuxAPI();
  const { av, caAlias } = props;
  const [selected, setSelected] = useState(false);

  /*const imgClasses = `fc-attribute-header--info--image ${skeleton ? 'fc-skeleton': ''}`;
  const caClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const avClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const iconClasses = `fc-attribute-header--icon--image ${skeleton ? 'fc-skeleton': ''}`;*/

  return (
    <>
      {
        <li key={av.id}>
          <button
            type='button'
            className='fc-swatch'
            onClick={(e) => console.log(e)}
          >
            <div className='fc-swatch-wrapper'>
              <div className='fc-swatch-wrapper--img'>
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
