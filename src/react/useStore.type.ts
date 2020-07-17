import type { Dispatcher, Entity } from '../shared.types';
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
  <Payload>(matcher: Matcher<State, Payload, undefined>): [
    State,
    Dispatcher<Payload>
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
  <Payload, A extends keyof State>(matcher: Matcher<State[A], Payload, [A]>): [
    State[A],
    Dispatcher<Payload>
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
  <Payload, A extends keyof State, B extends keyof State[A]>(
    matcher: Matcher<State[A][B], Payload, [A, B]>
  ): [State[A][B], Dispatcher<Payload>];

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
    Payload,
    A extends keyof State,
    B extends keyof State[A],
    C extends keyof State[A][B]
  >(
    matcher: Matcher<State[A][B][C], Payload, [A, B, C]>
  ): [State[A][B][C], Dispatcher<Payload>];

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
    Payload,
    A extends keyof State,
    B extends keyof State[A],
    C extends keyof State[A][B],
    D extends keyof State[A][B][C]
  >(
    matcher: Matcher<State[A][B][C][D], Payload, [A, B, C, D]>
  ): [State[A][B][C][D], Dispatcher<Payload>];

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
    Payload,
    A extends keyof State,
    B extends keyof State[A],
    C extends keyof State[A][B],
    D extends keyof State[A][B][C],
    E extends keyof State[A][B][C][D]
  >(
    matcher: Matcher<State[A][B][C][D][E], Payload, [A, B, C, D, E]>
  ): [State[A][B][C][D][E], Dispatcher<Payload>];
}
