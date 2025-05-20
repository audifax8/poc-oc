import React from 'react';

import './index.scss';
interface IViewMoreProps {
  label: String;
  remainingItems: number;
  onClickCallback?: Function;
  skeleton?: boolean;
};

export const ViewMore = (props: IViewMoreProps) => {
  const { remainingItems, label, onClickCallback } = props;

  const onClick = (e: React.MouseEvent) => {
    if (onClickCallback) {
      return onClickCallback(e);
    }
    return e;
  };

  return (
    <button
      type='button'
      className='fc-view-more'
      onClick={onClick}
    >
      <div className='fc-view-more--wrapper'>
        <div className='fc-view-more--wrapper--amount'>
          {`+ ${remainingItems}`}
          </div>
        <div className='fc-view-more--wrapper--name'>
          <span>{label}</span>
        </div>
      </div>
    </button>
  );
};