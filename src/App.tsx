import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { PreloadScripts } from './hooks/preload';
import { LuxAPIProvider } from './providers/lux-api';
import { RTRProvider } from './providers/rtr';
import { VMProvider } from './providers/vm';
import { RXCProvider } from './providers/rxc';
import store from './store';

import { Wrapper } from './components/wrapper';

import './App.scss';
function App() {
  return (
    <div className='fc-app'>
      <BrowserRouter>
        <Provider store={store}>
          <PreloadScripts></PreloadScripts>
          <LuxAPIProvider>
            <RTRProvider>
              <RXCProvider>
                <VMProvider>
                  <Wrapper />
                </VMProvider>
              </RXCProvider>
            </RTRProvider>  
          </LuxAPIProvider>
          </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
