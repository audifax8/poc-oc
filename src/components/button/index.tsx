import React from 'react';
import { useSelector } from 'react-redux';

import { IState } from '../../interfaces';

import './index.scss';

export default function Button(props: any) {
  const { icon, label, onClickCallback, enabled } = props;
  const darkMode = useSelector((state: IState) => state?.ui?.darkMode);

  const onClick = (e: React.MouseEvent) => {
    if (onClickCallback) {
      return onClickCallback(e);
    }
    return e;
  };

  return (
    <button
      className={`${!enabled ? 'fc-skeleton' : ''} fc-button ${darkMode ? 'fc-dark-mode' : ''}`}
      onClick={onClick}
      disabled={!enabled}
    >
      {icon && icon}
      {label && <label className={`fc-button--label`}>{label}</label>}
    </button>
  );
};