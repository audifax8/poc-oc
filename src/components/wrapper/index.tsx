import React from 'react';

import './index.scss';
/*import Header from './header';
import Footer from './footer';
import Menu from './menu';
*/
import { RBNHeader } from '../rbn-header';
import { Header } from '../header';
import { Model } from '../model';
import { useSelector } from 'react-redux';
import { IState } from '../../interfaces';

export function Wrapper() {
  const { darkMode, menuOpen } = useSelector((state: IState) => state?.ui);

  const classes = `fc-wrapper ${darkMode ? 'fc-dark-mode' : ''} ${menuOpen ? 'fc-menu-open': ''}`;
  return (
    <div className={classes}>
      <RBNHeader />
      <Header />
      <Model />
      <div id='rxcApp' className='rxcApp'></div>
    </div>
  );
};
