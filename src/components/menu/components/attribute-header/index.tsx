import React from 'react';
import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AttributeHeaderDivider } from '../attribute-header-divider';
import { Swatch } from '../swatch';
import { ViewMore } from '../view-more';

import { setMenuOpen, loadAVs } from '../../../../store/menu';
import { setCamera } from '../../../../store/rtr';

import { useLuxAPI } from '../../../../providers/lux-api';
import { useRTR } from '../../../../providers/rtr';

import { IMenuCA, IState } from '../../../../interfaces';

import './index.scss';

export interface IAttributeHeaderPropTypes {
  caAlias: string;
  skeleton?: boolean;
  mockCA?: any;
};

export const AttributeHeader = memo(function (props: IAttributeHeaderPropTypes) {
  const dispatch = useDispatch();
  const { luxService } = useLuxAPI();
  const { rtrAssets } = useRTR();
  const { caAlias, skeleton, mockCA } = props;

  const menuCa = useSelector((state: IState) => state.menu.cas.find(ca => ca.alias === caAlias)) as IMenuCA || mockCA;
  const { camera } = useSelector((state: IState) => state.rtr);
  const { params: { avoidLuxAPI } } = useSelector((state: IState) => state?.fc);

  const imgClasses = `fc-attribute-header--info--image ${skeleton ? 'fc-skeleton': ''}`;
  const caClasses = `fc-attribute-header--info--ca-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const avClasses = `fc-attribute-header--info--av-name ${skeleton ? 'fc-skeleton fc-skeleton-text': ''}`;
  const iconClasses = `fc-attribute-header--icon--image ${skeleton ? 'fc-skeleton': ''}`;

  const onViewMoreClick = () => {
    const newData = luxService.reloadPagination(caAlias, menuCa?.currentPage, menuCa?.open);
    dispatch(loadAVs({ caAlias, newData }));
  };

  const openMenu = () => {
    if (skeleton) { return; }
    if (camera !== caAlias) {
      dispatch(setCamera(caAlias));
    }
    dispatch(setMenuOpen({ open: !menuCa?.open, caAlias }));
    if (!avoidLuxAPI) {
      rtrAssets.preloadAssets(caAlias);
    }
  };

  return (
    <>
      <h3 className='fc-attribute-header'>
        <button
          type='button'
          aria-expanded={menuCa?.open}
          aria-controls='sect1'
          id='accordion1id'
          className='fc-attribute-header-button'
          onClick={openMenu}
        >
          <div className='fc-attribute-header--info'>
            <div className={imgClasses}>
            {skeleton ?
              <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'></svg> :
              <img src={`./img/${menuCa?.icon}.webp`} alt={menuCa?.icon} width={48} height={48} aria-hidden={true}/>
            }
            </div>
            <div className={caClasses}>
              {!skeleton && <span>{menuCa?.caName}</span>}
            </div>
            <div className={avClasses}>
              {!skeleton && <span>{menuCa?.selectedAvName}</span>}
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
          {menuCa?.avs && menuCa?.avs?.length && (
            menuCa?.avs.map(
              (av, index) => 
                <li key={av.id || index}>
                  <Swatch av={av} caAlias={menuCa?.alias} selectedAvId={menuCa?.selectedAvId} index={index}/>
                </li>
            )
          )}
          {menuCa?.currentPage < menuCa?.avsLenght &&
            <li key={menuCa?.avs?.length}>
              <ViewMore
                remainingItems={menuCa?.avsLenght - menuCa?.currentPage}
                label='view more'
                onClickCallback={onViewMoreClick}
              />
            </li>
          }
        </ul>
      )}
      <AttributeHeaderDivider />
    </>
  );
});
