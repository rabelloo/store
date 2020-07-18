import React from 'react';
import { Bar } from './App/Bar';
import { Foo } from './App/Foo';
import { Reset } from './App/Reset';
import { RootState } from './App/RootState';
import { StoreProvider } from './store';

export const App = () => (
  <StoreProvider>
    <RootState />
    <br />
    <Foo />
    <br />
    <br />
    <Bar />
    <br />
    <br />
    <Reset />
  </StoreProvider>
);
