import React from 'react';
import { Provider } from 'react-redux';

import { PreloadMainScripts } from './hooks/preload-main-scripts';
import { PreloadSecondaryScripts } from './hooks/preload-secondary-scripts';

import { LuxAPIProvider } from './providers/lux-api';
import { LuxAPIWorkerProvider } from './providers/lux-api-web-worker';
import { RTRWorkerProvider } from './providers/rtr-web-worker';
import { RTRAssetsWorkerProvider } from './providers/rtr-assets-web-worker';
import { RTRProvider } from './providers/rtr';
import { VMProvider } from './providers/vm';
import { RXCProvider } from './providers/rxc';
import store from './store';

import { Wrapper } from './components/wrapper';

import './App.scss';
function App() {
  return (
    <div className='fc-app'>
      <Provider store={store}>
        <PreloadMainScripts></PreloadMainScripts>
        <LuxAPIWorkerProvider>
          <RTRProvider>
            <RTRAssetsWorkerProvider>
              <Wrapper />
            </RTRAssetsWorkerProvider>
          </RTRProvider>
        </LuxAPIWorkerProvider>
      </Provider>
    </div>
  );
}

export default App;
