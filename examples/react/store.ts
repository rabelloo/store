import { createStore, createStoreContext } from '../../src';

const initialState: State = {
  bar: 'bar',
  foo: {
    bar: 'inner bar',
  },
};

const store = createStore(initialState, { mode: 'development' });

export const { StoreProvider, useStore } = createStoreContext(store);

interface State {
  bar: string;
  foo: { bar: string };
}
