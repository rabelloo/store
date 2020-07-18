import React from 'react';
import { Bar } from './Bar';
import { Foo } from './Foo';
import { Reset } from './Reset';
import { RootState } from './RootState';
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
