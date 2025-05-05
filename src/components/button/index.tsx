import React from 'react';
import { useSelector } from 'react-redux';

import { IState } from '../../interfaces';

import './index.scss';

interface IButtonProps {
  label?: String;
  enabled: Boolean;
  onClickCallback: Function;
  skeleton?: Boolean;
  icon?: any;
};

export default function Button(props: IButtonProps) {
  const { icon, label, onClickCallback, enabled, skeleton } = props;
  const darkMode = useSelector((state: IState) => state?.ui?.darkMode);

  const onClick = (e: React.MouseEvent) => {
    if (onClickCallback) {
      return onClickCallback(e);
    }
    return e;
  };

  return (
    <button
      className={`${skeleton ? 'fc-skeleton' : ''} fc-button ${darkMode ? 'fc-dark-mode' : ''}`}
      onClick={onClick}
      disabled={!enabled}
    >
      {icon && icon}
      {label && <label className={`fc-button--label`}>{label}</label>}
    </button>
  );
};