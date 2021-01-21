/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useState } from 'react';
import type { Slice } from '../core/slice.type';
import type { Store } from '../createStore';
import type { Entity, Immutable, MaybeOptional } from '../shared.types';
import type { Matcher } from './matcher.type';

/**
 * Base implementation of `useStore`.
 * Not meant to be used directly, but wrapped with `createHooks`,
 * so that StoreContext is captured within the closure.
 * @param StoreContext StoreContext to be captured in the closure.
 * @param dispatchers Map<type, Dispatcher> to prevent double registration of the same type.
 * @param arg Polymorphic: `undefined` or `State => Select` or `{Matcher}`
 */
export function useStore<State extends Entity, Select, Payload>(
  StoreContext: React.Context<Store<State>>,
  arg?:
    | ((state: Immutable<State>) => Immutable<Select>)
    | Matcher<State, Payload>
) {
  const store = useContext(StoreContext);

  // overload management
  const [slice, select, matcher] = useMemo(() => overload(store, arg), []);

  // actual state, lazily initialised
  const [state, setState] = useState(() => select(slice.state));

  // Types can only be registered once,
  // so we have to guarantee `slice.on` is only ever called once
  // and that the dispatcher is always the same.
  // `<React.StrictMode>` renders components twice,
  // so unfortunately we can't use lazily initialised `useState`, e.g.
  // useState(() => matcher ? slice.on(matcher.type, matcher.reduce) : noop);
  // We can't use `useCallback` because it can't be initialised,
  // and we can't use `useMemo` because it's not semantically guaranteed.
  // `useEffect(, [])` is the only thing guaranteed to only run once.
  type Dispatch = (payload: MaybeOptional<Payload>) => void;
  const [dispatcher, setDispatcher] = useState<Dispatch>(() => noop);
  useEffect(() => {
    /* istanbul ignore else */
    if (matcher) setDispatcher(slice.on(matcher.type, matcher.reduce));
  }, []);

  // subscribe to changes to refresh state
  useEffect(() => slice.subscribe((state) => setState(select(state))), []);

  return [state, dispatcher];
}

function overload<State extends Entity, Payload, Select>(
  store: Store<State>,
  arg?:
    | ((state: Immutable<State>) => Immutable<Select>)
    | Matcher<State, Payload, any> // eslint-disable-line @typescript-eslint/no-explicit-any
): Triple<State, Select, Payload> {
  // useStore()
  if (arg == null) return [store, identity];

  // useStore(state => state.foo)
  if (arg instanceof Function) return [store, arg];

  // useStore({ type, reduce })
  if (!arg.slice) return [store, identity, arg];

  const slice = store.slice(...(arg.slice as [string]));
  const getSliceState = () => slice.state;

  // useStore({ slice, type, reduce })
  return [slice, getSliceState, arg];
}

const identity = <T>(a: T) => a;
const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

type Triple<State, Select, Payload> = [
  Slice<State>,
  (state: Immutable<State>) => Immutable<State | Select>,
  Matcher<State, Payload>?
];
