import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { PreloadScripts } from './hooks/preload';
import { CoreProvider } from './providers/core';
import store from './store';

import { Wrapper } from './components/wrapper';

import './App.scss';
function App() {
  return (
    <div className='fc-app'>
      <BrowserRouter>
        <Provider store={store}>
          <CoreProvider>
            <PreloadScripts></PreloadScripts>
              <Wrapper />  
          </CoreProvider>
          </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
