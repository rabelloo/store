import { html } from 'lit-html';
import { Bar } from './App/Bar';
import { Foo } from './App/Foo';
import { Reset } from './App/Reset';
import { RootState } from './App/RootState';
import { State } from './store';

export const App = (state: State) => html`
  ${RootState(state)}
  <br />
  ${Foo(state.foo)}
  <br />
  <br />
  ${Bar(state.bar)}
  <br />
  <br />
  ${Reset()}
`;
