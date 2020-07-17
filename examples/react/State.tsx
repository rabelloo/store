import React from 'react';
import { useStore } from './store';

export const State = () => {
  const [state] = useStore();
  console.log('render State', state);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
