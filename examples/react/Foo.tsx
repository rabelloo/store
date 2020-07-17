import React from 'react';
import { useStore } from './store';

export const Foo = () => {
  const [foo, setFooBar] = useStore({
    slice: ['foo'],
    type: '[Foo] derp',
    reduce: (_, bar: string) => ({ bar }),
  });
  console.log('render Foo', foo);

  return <input value={foo.bar} onChange={(e) => setFooBar(e.target.value)} />;
};
