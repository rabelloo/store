import React from 'react';
import { useStore } from '../store';

const initialState = {
  bar: 'bar',
  foo: { bar: 'inner bar' },
};

export const Reset = () => {
  const [, reset] = useStore({
    type: '[Reset] derp',
    reduce: () => initialState,
  });
  console.log('render Reset');

  return <button onClick={reset}>Reset</button>;
};
