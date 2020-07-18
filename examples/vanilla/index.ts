import { render } from 'lit-html';
import { App } from './App';
import { store } from './store';

store.subscribe((state) => render(App(state), document.body));
