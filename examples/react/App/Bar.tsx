import React from 'react';
import { useStore } from '../store';

export const Bar = () => {
  const [bar, setBar] = useStore({
    slice: ['bar'],
    type: '[Bar] derp',
    reduce: (_, bar: string) => bar,
  });
  console.log('render Bar', bar);

  return <input value={bar} onInput={(ev) => setBar(ev.currentTarget.value)} />;
};
