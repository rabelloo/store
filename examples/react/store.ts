import {
  createStore,
  createStoreContext,
  freeze,
  logger,
  persist,
} from '../../src';

const initialState: State = {
  bar: 'bar',
  foo: {
    bar: 'inner bar',
  },
};

const store = createStore(initialState, {
  mode: 'development',

  middleware: [freeze(), logger(), persist('examples/vanilla')],
});

export const { StoreProvider, useStore } = createStoreContext(store);

export interface State {
  bar: string;
  foo: { bar: string };
}
