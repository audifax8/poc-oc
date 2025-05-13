import React from 'react';
import { useSelector } from 'react-redux';

import './index.scss';

interface IViewMoreProps {
  label: String;
  remainingItems: number;
  onClickCallback?: Function;
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
      className={`fc-view-more`}
      onClick={onClick}
      aria-label={``}
    >
      <div className='fc-view-more--button'>
        <span className='fc-view-more--button--items'>{`+ ${remainingItems}`}</span>
        <span className='fc-view-more--button--label'>{label}</span>
      </div>
    </button>
  );
};