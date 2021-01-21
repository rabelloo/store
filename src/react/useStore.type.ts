import type { Entity, MaybeOptional } from '../shared.types';
import type { Matcher } from './matcher.type';

export interface UseStore<State extends Entity> {
  /**
   * Use `@store` state.
   * @returns Tuple of `[state]`.
   * @example const [state] = useStore();
   */
  (): [State];

  /**
   * Use a selection of `@store` state.
   * @param select Function that selects a value out of `@store` state.
   * @returns Tuple of `[select]`.
   * @example const [state] = useStore(state => state.foo === 'bar');
   */
  <Select>(select: (state: State) => Select): [Select];

  /**
   * Use `@store` state and configure a dispatcher for the root.
   * @param matcher Type and reducer to register.
   * @returns Tuple of `[state, dispatcher(payload) => void]`.
   * @example
   * const [rootState, setRootState] = useStore({
   *   type: '[My Component] override entire store',
   *   reduce: (_, state) => state
   * });
   * setRootState({ foo: 'bar' });
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <M extends Matcher<State, any, undefined>>(matcher: M): [
    State,
    DispatcherOf<M>
  ];

  /**
   * Use `@store[slice]` state and configure a dispatcher for the slice.
   * @param matcher Slice path, type and reducer to register.
   * @returns Tuple of `[slice, dispatcher(payload) => void]`.
   * @example
   * const [count, modifyCount] = useStore({
   *   slice: ['count'],
   *   type: '[My Component] modify count',
   *   reduce: (count, mod: number) => count + mod
   * });
   * modifyCount(1);
   * modifyCount(-1);
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <M extends Matcher<State[A], any, [A]>, A extends keyof State>(matcher: M): [
    State[A],
    DispatcherOf<M>
  ];

  /**
   * Use `@store[slice]` state and configure a dispatcher for the slice.
   * @param matcher Slice path, type and reducer to register.
   * @returns Tuple of `[slice, dispatcher(payload) => void]`.
   * @example
   * const [count, modifyCount] = useStore({
   *   slice: ['foo', 'count'],
   *   type: '[My Component] modify foo count',
   *   reduce: (count, mod: number) => count + mod
   * });
   * modifyCount(1);
   * modifyCount(-1);
   */
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    M extends Matcher<State[A][B], any, [A, B]>,
    A extends keyof State,
    B extends keyof State[A]
  >(
    matcher: M
  ): [State[A][B], DispatcherOf<M>];

  /**
   * Use `@store[slice]` state and configure a dispatcher for the slice.
   * @param matcher Slice path, type and reducer to register.
   * @returns Tuple of `[slice, dispatcher(payload) => void]`.
   * @example
   * const [count, modifyCount] = useStore({
   *   slice: ['foo', 'bar', 'count'],
   *   type: '[My Component] modify foo bar count',
   *   reduce: (count, mod: number) => count + mod
   * });
   * modifyCount(1);
   * modifyCount(-1);
   */
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    M extends Matcher<State[A][B][C], any, [A, B, C]>,
    A extends keyof State,
    B extends keyof State[A],
    C extends keyof State[A][B]
  >(
    matcher: M
  ): [State[A][B][C], DispatcherOf<M>];

  /**
   * Use `@store[slice]` state and configure a dispatcher for the slice.
   * @param matcher Slice path, type and reducer to register.
   * @returns Tuple of `[slice, dispatcher(payload) => void]`.
   * @example
   * const [count, modifyCount] = useStore({
   *   slice: ['foo', 'bar', 'zed', 'count'],
   *   type: '[My Component] modify foo bar zed count',
   *   reduce: (count, mod: number) => count + mod
   * });
   * modifyCount(1);
   * modifyCount(-1);
   */
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    M extends Matcher<State[A][B][C][D], any, [A, B, C, D]>,
    A extends keyof State,
    B extends keyof State[A],
    C extends keyof State[A][B],
    D extends keyof State[A][B][C]
  >(
    matcher: M
  ): [State[A][B][C][D], DispatcherOf<M>];

  /**
   * Use `@store[slice]` state and configure a dispatcher for the slice.
   * @param matcher Slice path, type and reducer to register.
   * @returns Tuple of `[slice, dispatcher(payload) => void]`.
   * @example
   * const [count, modifyCount] = useStore({
   *   slice: ['foo', 'bar', 'zed', 'yoo', 'count'],
   *   type: '[My Component] modify foo bar zed yoo count',
   *   reduce: (count, mod: number) => count + mod
   * });
   * modifyCount(1);
   * modifyCount(-1);
   */
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    M extends Matcher<State[A][B][C][D][E], any, [A, B, C, D, E]>,
    A extends keyof State,
    B extends keyof State[A],
    C extends keyof State[A][B],
    D extends keyof State[A][B][C],
    E extends keyof State[A][B][C][D]
  >(
    matcher: M
  ): [State[A][B][C][D][E], DispatcherOf<M>];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DispatcherOf<T> = T extends Matcher<any, void, any>
  ? () => void
  : T extends Matcher<any, infer Payload, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ? (payload: MaybeOptional<Payload>) => void
  : never;
