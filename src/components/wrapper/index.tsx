import React from 'react';
import { useSelector } from 'react-redux';

import { RBNHeader } from '../rbn-header';
import { Header } from '../header';
import { Model } from '../model';
import { Menu } from '../menu';
import { Footer } from '../footer';
import { IState } from '../../interfaces';

import './index.scss';

export function Wrapper() {
  const { darkMode, menuOpen } = useSelector((state: IState) => state?.ui);
  const { showBackgroundImg } = useSelector((state: IState) => state?.fc?.params);

  const classes =
    `fc-wrapper ${darkMode ? 'fc-dark-mode' : ''} ${menuOpen ? 'fc-menu-open': ''} ${showBackgroundImg ? 'fc-show-background' : ''}`;
  return (
    <div className={classes}>
      <RBNHeader />
      <Header />
      <div className='fc-main'>
        <Model />
        <div className='fc-menu-footer'>
          <Menu />
          <Footer />
        </div>
      </div>
      <div id='rxcApp' className='rxcApp'></div>
    </div>
  );
};
