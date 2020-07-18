import React from 'react';
import { useStore } from './store';

export const RootState = () => {
  const [state] = useStore();
  console.log('render State', state);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
