import React from 'react';
import { Provider } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';

import logo from './logo.svg';
import './App.scss';

import { PreloadScripts } from './hooks/preload';

import { CoreProvider } from './providers/core';

import store from './store';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <BrowserView>
      <Provider store={store}>
      <CoreProvider>
      <PreloadScripts></PreloadScripts>
        <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className='App-link'
              href='https://reactjs.org'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn React
            </a>
        </header>
      </CoreProvider>
      </Provider>
      </BrowserView>
      <MobileView>
        <Provider store={store}>
        <CoreProvider>
          <header className='App-header'>
              <img src={logo} className='App-logo' alt='logo' />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className='App-link'
                href='https://reactjs.org'
                target='_blank'
                rel='noopener noreferrer'
              >
                Learn React
              </a>
          </header>
        </CoreProvider>
        </Provider>
      </MobileView>
      </BrowserRouter>
    </div>
  );
}

export default App;
