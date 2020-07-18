import { html } from 'lit-html';
import { store } from '../store';

const setFooBar = store
  .slice('foo')
  .on('[Foo] derp', (_, bar: string) => ({ bar }));

export const Foo = (foo: { bar: string }) => {
  console.log('render Foo', foo);

  return html`<input
    .value=${foo.bar}
    @input=${(ev: ChangeEvent) => setFooBar(ev.currentTarget.value)}
  />`;
};

interface ChangeEvent extends InputEvent {
  currentTarget: HTMLInputElement;
}
