import { html } from 'lit-html';
import { Bar } from './Bar';
import { Foo } from './Foo';
import { Reset } from './Reset';
import { RootState } from './RootState';
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
