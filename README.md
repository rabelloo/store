# Store

Redux reimagined with usability in mind and React hooks.

TODO: find a good name

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

### Vanilla

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
const reducer = (state, myPayload: boolean) => state;
const dispatch = store.on(type, reducer);

dispatch(true);

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

// or you can slice() your state :D
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
// See config for more.
store.dispatch({ type: 'my action', payload: { optional: true } });
```

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

#### React

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
      onClick={(ev) => setFoo(ev.currentTarget.value)}
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
