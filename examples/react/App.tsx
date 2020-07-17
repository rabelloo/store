import React from 'react';
import { Bar } from './Bar';
import { Foo } from './Foo';
import { State } from './State';
import { StoreProvider } from './store';

export const App = () => (
  <StoreProvider>
    <State />
    <Foo />
    <br />
    <br />
    <Bar />
  </StoreProvider>
);
