import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './index.scss';

interface IViewMoreProps {
  label: String;
  remainingItems: number;
  onClickCallback?: Function;
  skeleton?: boolean;
};

export const ViewMore = (props: IViewMoreProps) => {
  const dispatch = useDispatch();
  const { remainingItems, label, onClickCallback, skeleton } = props;

  const onClick = (e: React.MouseEvent) => {
    if (onClickCallback) {
      return onClickCallback(e);
    }
    return e;
  };

  const imgClasses =
    `fc-swatch-wrapper--img ${false ?
      'fc-swatch-wrapper--img--selected':
      'fc-swatch-wrapper--img--border'}`

  return (
    <>
    {
      <li key={11}>
        <button
          type='button'
          className='fc-swatch'
          onClick={() => {
            //return dispatch(updateSelectedAv({ avId: av.id, caAlias }));
          }}
        >
          <div className='fc-swatch-wrapper'>
            <div className={imgClasses}>
              {`+ ${remainingItems}`}
              </div>
            <div className='fc-swatch-wrapper--name'>
              <span>{label}</span>
            </div>
          </div>
        </button>
      </li>
    }
    </>
  );
};