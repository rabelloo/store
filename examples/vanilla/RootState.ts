import { html } from 'lit-html';
import { State } from './store';

export const RootState = (state: State) => {
  console.log('render RootState', state);

  return html`<pre>${JSON.stringify(state, null, 2)}</pre>`;
};
