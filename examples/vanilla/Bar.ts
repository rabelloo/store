import { html } from 'lit-html';
import { store } from './store';

const setBar = store.slice('bar').on('[Bar] derp', (_, bar: string) => bar);

export const Bar = (bar: string) => {
  console.log('render Bar', bar);

  return html`<input
    .value=${bar}
    @input=${(ev: ChangeEvent) => setBar(ev.currentTarget.value)}
  />`;
};

interface ChangeEvent extends InputEvent {
  currentTarget: HTMLInputElement;
}
