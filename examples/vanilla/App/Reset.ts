import { html } from 'lit-html';
import { store } from '../store';

const reset = store.on('[Reset] derp', () => ({
  bar: 'bar',
  foo: { bar: 'inner bar' },
}));

export const Reset = () => {
  console.log('render Reset');

  return html`<button @click=${reset}>Reset</button>`;
};
