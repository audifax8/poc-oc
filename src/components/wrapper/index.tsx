import React from 'react';

import './index.scss';
/*import Header from './header';
import Footer from './footer';
import Menu from './menu';
import Model from './model';*/
import { Header } from '../rbn-header';
import { useSelector } from 'react-redux';
import { IState } from '../../interfaces';

export function Wrapper() {
  const { darkMode, menuOpen } = useSelector((state: IState) => state?.ui);

  const classes = `fc-wrapper ${darkMode ? 'fc-dark-mode' : ''} ${menuOpen ? 'fc-menu-open': ''}`;
  return (
    <div className={classes}>
      <Header />
      <div id='rxcApp' className='rxcApp'></div>
    </div>
  );
};


/**
 * <RbnHeader />
      <Header />
      <Model />
      <Footer />
      <Menu />
 */
