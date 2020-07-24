# Store ~ [![ci](https://github.com/rabelloo/store/workflows/ci/badge.svg)](/actions) [![codecov](https://codecov.io/gh/rabelloo/store/branch/master/graph/badge.svg)](https://codecov.io/gh/rabelloo/store) [![dependencies](https://img.shields.io/david/rabelloo/store.svg)](https://david-dm.org/rabelloo/store)

Redux reimagined with usability in mind and React hooks.

TODO: find a good name

## Table of contents

- [Philosophy](#Philosophy)
- [Installation](#Installation)
- [Usage](#Usage)
- [Config](#Config)
- [Middleware](#Middleware)
- [Async](#Async)

## Philosophy

- All you need to create a store is your initial state.
- Reducers are tied to types and execute directly on the action payload.
- Reducers are also added to the store as they are needed, instead of during creation.
- You can `slice()` your store and dispatch directly to it, changing only that part of state.

Restrictions (basically same as Redux):

- All state must be serialisable, essentially JS primitives.
- Reducers must be pure (don't mutate state) and return the new state.
- Types must be unique - trying to register the same type again will throw an error.
- (Recommended) store should be used as singleton (easy to do with ES modules, e.g. `export store`).

The advantages are:

- Read and write are all O(1)
- No boilerplate code (`switch`, action creators)
- Granular control of state (with `slice`)
- Modularity (register types and reducers in-place, as they are needed)

Improved from Redux:

- Immutability and purity
  - TS types makes the entire state readonly
  - In `mode: 'development'` it is efficiently deeply frozen
- Scalable
  - There's no innate overhead, performance is determined by your reducers individually
  - Subscriptions are notified only when their `slice` is affected (no diff or dirty checking)

## Installation

TODO: find a name to publish on npm

```bash
npm i store
```

## Usage

- [Vanilla](#Vanilla)
- [React](#React)

### Vanilla

Also see [examples/vanilla](/examples/vanilla)

```ts
import { createStore } from 'store';

const initialState = {
  count: 0,
};

// recommended usage as a singleton (one per app)
export const store = createStore(initialState);

console.log(store.state);
// { count: 0 }
```

```ts
// register reducers per type and get their dispatcher
const type = 'foo';
const reducer = (state, foo: boolean) => state;
const dispatchFoo = store.on(type, reducer);

dispatchFoo(true);
// same as `store.dispatch({ type, payload: true });`

console.log(store.state);
// { count: 0 }
```

```ts
// you can use `on()` directly on the root
const setCount = store.on(
  '[My Component] set count',
  // but you have to do boring state stitching/merging
  (state, count: number) => ({ ...state, count })
);

setCount(5);

console.log(store.state);
// { count: 5 }

// or you can `slice()` your state :D
const incrementCount = store
  .slice('count')
  .on('[My Component] increment count', (count, mod: number) => count + mod);

incrementCount(-5);

console.log(store.state);
// { count: 0 }
```

```ts
// you can also dispatch actions directly on the store or slices.
// There's no advantage in doing so, and not having the type registered
// will throw an error if your `mode` is "development".
store.dispatch({ type: 'my action', payload: { optional: true } });
```

See [Config](#Config) for more.

```ts
// subscribe to changes
store.subscribe((state) => console.log('root state:', state));
store.slice('count').subscribe((count) => console.log('count:', count));
store.slice('foo').subscribe((foo) => console.log('foo:', foo));

store.dispatch(/* action that changes `state.count` */);
// root state: { count: 1, foo: false }
// count: 1

store.dispatch(/* action that changes `state.foo` */);
// root state: { count: 1, foo: true }
// foo: true

store.dispatch(/* action that changes `state` */);
// root state: { count: 0, foo: false }
// count: 0
// foo: false
```

Also see [examples/vanilla](/examples/vanilla)

### React

Also see [examples/react](/examples/react)

```ts
import { createStore, createStoreContext } from 'store';

const initialState = {
  foo: 'bar',
};

// create store like vanilla
const store = createStore(initialState);

// but then export the Provider and hook
export const { StoreProvider, useStore } = createStoreContext(store);
```

```tsx
// provide your store context to your app
export const Root = () => (
  <StoreProvider>
    <App />
  </StoreProvider>
);
```

```tsx
export function RootState() {
  // entire root state
  const [state] = useStore();

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
```

```tsx
export function Foo() {
  // select from state
  const [foo] = useStore((state) => state.foo);

  return <div>{foo}</div>;
}
```

```tsx
export function RootStateReset() {
  // register a type and reducer
  const [state, setState] = useStore({
    type: '[FooInput] set foo',
    reduce: (_state, newState: State) => newState,
  });

  return <button onClick={() => setFoo({ foo: 'bar' })}>Reset state</button>;
}
```

```tsx
export function FooInput() {
  // slice, then register a type and reducer
  const [foo, setFoo] = useStore({
    slice: ['foo'],
    type: '[FooInput] set foo',
    reduce: (_, foo: string) => foo,
  });

  return (
    <input
      defaultValue={foo}
      onInput={(ev) => setFoo(ev.currentTarget.value)}
    />
  );
}
```

```tsx
// TypeScript's tuple inference is still not perfect,
// so if your editor is not suggesting your state's keys correctly
// you can use the function `my().at()` to help create the slice array.
import { my } from 'store';

const initialState = { foo: { bar: 'foo.bar' } };
type State = typeof initialState;

// use your State interface/type
const { at } = my<State>();

const [fooBar, setFooBar] = useStore({
  slice: at('foo', 'bar'),
  // same as ['foo', 'bar']
  // but now with TypeScript suggestions as you type
});
```

Also see [examples/react](/examples/react)

## Config

```ts
const initialState = {};

// config is second argument
const store = createStore(initialState, {
  mode: 'development' || 'test' || 'production',
  middleware: [myMiddleware, anotherMiddleware],
});

// when not specified, the default is:
const defaultConfig = {
  mode: process.env.NODE_ENV || 'production',
  middleware: mode === 'development' ? [logger(), freeze()] : [],
};

// each config field has to be overriden individually.
// e.g. this will still have the default middleware applied
const store = createStore(initialState, {
  mode: 'development',
});
```

### Mode

Running in `development` has one major difference:

> When an unregistered `type` of action is dispatched, an `Error` will be thrown.

This helps find bugs earlier in the development cycle, as `types` are untyped (TypeScript wise), and you might not catch typos or other errors.

```ts
// e.g.
const sendMyAction = store.on('my action', (state) => state);

// will never throw as the `type` is captured in the closure
sendMyAction();

// not recommended, but here's where the Error being thrown helps
store.dispatch({ type: 'my actio' });
// Error('No registered reducer for "my actio"')
```

It is recommended you set the environment variable `NODE_ENV` depending on where you're running code.

That way the `config`'s `mode` and `middleware` will be applied correctly per environment, as suggested in [Config](#Config).

Still, if you have a different way to determine your environment, feel free to pass a variable to your config.

```ts
const store = createStore(initialState, {
  mode: isProduction ? 'production' : 'development',
});
```

## Middleware

Middleware are functions that run on every dispatch just after the reducer, but before setting the state.

They execute in the order in which they are provided on `createStore()`.

There are some middleware provided, those with an \* are applied by default when `mode === 'development'`:

- \*[Freeze](/src/middleware/freeze.ts) - Deeply freezes every action's payload dispatched to store.
  - Useful to ensure state is immutable.
  - Not recommended in `production` because performance.
- \*[Logger](/src/middleware/logger.ts) - Logs all middleware arguments on every action dispatch to store.
  - Useful to track changes and debug state.
  - Not recommended in `production` because it exposes internal state to console.
- [Persist](/src/middleware/persist.ts) - Persists state to localStorage and hydrates from it on init.
  - Useful when using Hot Module Reload or Fast Refresh.
  - Useful when you want the entire state to persist across sessions.

You can also create your own middleware to do what you will - e.g. logging to an external tool like DataDog.

```ts
export function myMiddleware<State>(): Middleware<State> {
  return ({ action, from, nextState, state }) => {
    DataDog.send({ action, from, nextState, state });

    // don't forget to return `nextState` or you might be left wondering
    // why your state is suddenly `undefined`.
    return nextState;
  };
}
```

`action` is e.g. `{ type, payload }`

`from` is:

- a string or symbol that represents the slice path.
- an unique key that might not be deterministic. **Try not to rely on its format.**
- e.g. root is `Symbol('@store root')`
- e.g. `slice('foo', 'bar')` is `'foo.bar'`

`nextState` is the output from the reducer, or from the previous middleware.

`state` is the current state of the slice or store.

## Async

You might be familiar with the concept of thunk middleware, or sagas, or asynchronous action dispatchers.

Due to how this library has been designed there should be no need for those, see:

```ts
const setFoo = store.on('[foo] success / set', (_, foo: string) => foo);
const asyncSetFoo = store.on('[foo] async set', (state) => {
  fetch('my/api').then(setFoo);
  return state;
});

asyncSetFoo();
```

But if for some reason you like async middleware feel free to use it.

```ts
// not recommended, but one example
export function asyncMiddleware<State>(): Middleware<State> {
  return async ({ action, from, nextState, state }) => {
    return await nextState;
  };
}

const asyncSetFoo = store.on('[foo] async set', () => fetch('my/api'));

asyncSetFoo();
```
