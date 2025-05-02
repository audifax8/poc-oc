import React from 'react';
import { useState, memo } from 'react';

import './index.scss';
import { IAttributeHeaderPropTypes } from '../../../../interfaces';
import { AttributeHeaderDivider } from '../attribute-header-divider';

export const AttributeHeader = memo(function (props: IAttributeHeaderPropTypes) {
  const { icon, skeleton } = props.caInfo;
  const [menuOpen, setMenuOpen] = useState(false);

  const imgClasses = `fc-attribute-header--info--image ${skeleton ? 'fc-skeleton': ''}`;
  const caClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const avClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const iconClasses = `fc-attribute-header--icon--image ${skeleton ? 'fc-skeleton': ''}`;

  return (
    <>
      {
        <li>
          <h3 className='fc-attribute-header'>
            <button
              type='button'
              aria-expanded={menuOpen}
              aria-controls='sect1'
              id='accordion1id'
              className='fc-attribute-header-button'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className='fc-attribute-header--info'>
                <div className={imgClasses}>
                {skeleton ?
                  <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg> :
                  <img src={`/img/${icon}.png`} alt={icon} width={48} height={48} aria-hidden={true}/>
                }
                </div>
                <div className={caClasses}>
                  <span>{props?.caInfo?.ca?.name}</span>
                </div>
                <div className={avClasses}>
                  <span>{props?.caInfo?.selectedAv?.name}</span>
                </div>
              </div>
              <div className={iconClasses}>
                {skeleton ?
                  <svg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'></svg> :
                  (
                    menuOpen ? 
                    (<svg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'>
                      <g clipPath='url(#clip0_3994_28473)'>
                        <path d='M8.37893 3.05702L16.1836 10.862L15.2409 11.8047L8.37893 4.94302L1.51693 11.8047L0.574261 10.862L8.37893 3.05702Z' fill='#1F1F24'/>
                      </g>
                      <defs>
                        <clipPath id='clip0_3994_28473'>
                          <rect width='16' height='16' fill='white' transform='matrix(-1 0 0 -1 16.3789 16)'/>
                        </clipPath>
                      </defs>
                    </svg>) :
                    (<svg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'>
                      <g clipPath='url(#clip0_3994_29036)'>
                        <path d='M8.37888 12.943L0.574219 5.13798L1.51689 4.19531L8.37888 11.057L15.2409 4.19531L16.1836 5.13798L8.37888 12.943Z' fill='#1F1F24'/>
                      </g>
                      <defs>
                        <clipPath id='clip0_3994_29036'>
                          <rect width='16' height='16' fill='white' transform='translate(0.378906)'/>
                        </clipPath>
                      </defs>
                    </svg>)
                  )
                }
              </div>
            </button>
          </h3>
          <AttributeHeaderDivider />
        </li>
      }
      {menuOpen && (<pre></pre>)}
    </>
  );
});
