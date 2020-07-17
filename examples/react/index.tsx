import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

render(<App />, document.getElementById('root'));

// Hot Module Replacement (HMR)
(module as { hot?: { accept(): void } }).hot?.accept();
