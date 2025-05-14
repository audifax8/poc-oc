import React from 'react';
import { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAttributeValue, IMenuCA, IState } from '../../../../interfaces';
import { AttributeHeaderDivider } from '../attribute-header-divider';
import { Swatch } from '../swatch';
import { ViewMore } from '../view-more';
import { setMenuOpen, loadAVs } from '../../../../store/menu';

import './index.scss';

export interface IAttributeHeaderPropTypes {
  caAlias: string;
  skeleton?: boolean;
};

export const AttributeHeader = memo(function (props: IAttributeHeaderPropTypes) {
  const dispatch = useDispatch();
  const { caAlias, skeleton } = props;
  const menuCa = useSelector((state: IState) => state.menu.cas.find(ca => ca.alias === caAlias)) as IMenuCA;

  const imgClasses = `fc-attribute-header--info--image ${skeleton ? 'fc-skeleton': ''}`;
  const caClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const avClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const iconClasses = `fc-attribute-header--icon--image ${skeleton ? 'fc-skeleton': ''}`;

  const onViewMoreClick = () => {
    dispatch(loadAVs({ caAlias }));
  };

  return (
    <li key={menuCa?.id}>
      <h3 className='fc-attribute-header'>
        <button
          type='button'
          aria-expanded={menuCa?.open}
          aria-controls='sect1'
          id='accordion1id'
          className='fc-attribute-header-button'
          onClick={() => dispatch(setMenuOpen({ open: !menuCa?.open, caAlias }))}
        >
          <div className='fc-attribute-header--info'>
            <div className={imgClasses}>
            {skeleton ?
              <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg> :
              <img src={`/img/${menuCa?.icon}.png`} alt={menuCa?.icon} width={48} height={48} aria-hidden={true}/>
            }
            </div>
            <div className={caClasses}>
              <span>{menuCa?.ca?.name}</span>
            </div>
            <div className={avClasses}>
              <span>{menuCa?.selectedAv?.name}</span>
            </div>
          </div>
          <div className={iconClasses}>
            {skeleton ?
              <svg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'></svg> :
              (
                menuCa?.open ? 
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
      {menuCa?.open && (
        <ul
          className='fc-attribute-values'
          aria-label='attribute values menu'
        >
          {menuCa?.avsToRender && menuCa?.avsToRender.length && (
            menuCa?.avsToRender.map((av) => <Swatch av={av} caAlias={menuCa?.ca?.alias}/>)
          )}
          {menuCa?.currentPage < menuCa?.avsLenght &&
            <ViewMore
              remainingItems={menuCa?.avsLenght - menuCa?.currentPage}
              label='view more'
              onClickCallback={onViewMoreClick}
            />
          }
        </ul>
      )}
      <AttributeHeaderDivider />
    </li>
  );
});
