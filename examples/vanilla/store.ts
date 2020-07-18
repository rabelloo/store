import { createStore, persist, logger, freeze } from '../../src';

const initialState: State = {
  bar: 'bar',
  foo: {
    bar: 'inner bar',
  },
};

export const store = createStore(initialState, {
  mode: 'development',
  middleware: [freeze(), logger(), persist('examples/vanilla')],
});

export interface State {
  bar: string;
  foo: { bar: string };
}
