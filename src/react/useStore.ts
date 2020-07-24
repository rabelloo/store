import { useContext, useEffect, useMemo, useState } from 'react';
import type { Slice } from '../core/slice.type';
import type { Store } from '../createStore';
import type { Dispatcher, Entity, Immutable, Index } from '../shared.types';
import type { Matcher } from './matcher.type';
/* eslint-disable react-hooks/exhaustive-deps */

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
  dispatchers: Index<Dispatcher<unknown>>,
  arg?:
    | ((state: Immutable<State>) => Immutable<Select>)
    | Matcher<State, Payload>
) {
  const store = useContext(StoreContext);

  // overload management
  const [slice, select, matcher] = useMemo(() => overload(store, arg), [store]);

  // avoid too much selection if avoidable
  const initialState = useMemo(() => select(slice.state), [slice]);

  // actual state control
  const [state, setState] = useState<Immutable<State | Select>>(initialState);

  // subscribe to changes to refresh state
  useEffect(
    () => slice.subscribe((state: Immutable<State>) => setState(select(state))),
    [slice]
  );

  // types can only be registered once,
  // so we cache the dispatcher and retrieve it.
  // We don't `useState` it either to prevent re-renders
  const dispatch = getDispatcher(dispatchers, slice, matcher);

  return [state, dispatch];
}

function getDispatcher<State extends Entity, Payload>(
  dispatchers: Index<Dispatcher<unknown>>,
  slice: Slice<State>,
  matcher?: Matcher<State, Payload>
) {
  if (!matcher) return noop;

  const { reduce, type } = matcher;

  const cached = dispatchers[type];
  if (cached) return cached;

  const dispatch = slice.on(type, reduce);
  dispatchers[type] = dispatch;
  return dispatch;
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
