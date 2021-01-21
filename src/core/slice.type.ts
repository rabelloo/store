import type {
  Action,
  Entity,
  Immutable,
  MaybeOptional,
  Reducer,
  Subscription,
} from '../shared.types';

export interface Slice<State extends Entity> {
  /**
   * Dispatches an `action` to the appropriate reducer according to `action.type`.
   * @param action Action to reduce.
   * @throws If `mode === 'development'` and reducer for `action.type` is not found.
   * @example
   * store.dispatch({
   *   type: 'my action',
   *   payload: 'foo'
   * });
   */
  dispatch<Payload>(action: Action<Payload>): void;
  /**
   * Registers `reducer` of `type` and returns a simplified dispatcher.
   * @param type Type of action to reduce.
   * @param reducer Function that takes in state and action to produce a new state.
   * @example
   * const overrideState = store.on(
   *   'my action',
   *   (_, state) => state
   * );
   * overrideState({ foo: 'bar' });
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on<R extends Reducer<State, any>>(type: string, reducer: R): DispatcherOf<R>;
  /** Path to this slice as a `string[]`. Empty array if root `@store`. */
  readonly path: ReadonlyArray<string>;
  /** Creates a slice of `state` that proxies methods for convenience. */
  slice: SliceAt<State>;
  /** Readonly `state` of the slice. */
  readonly state: Immutable<State>;
  /**
   * Subscribes to this slice's state changes.
   * @param subscription Function to execute when this slice's state changes.
   * @return A function that unsubscribes when called.
   * @example
   * const unsubscribe = store.subscribe(console.log);
   */
  subscribe(subscription: Subscription<State>): () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DispatcherOf<T> = T extends Reducer<any, void>
  ? () => void
  : T extends Reducer<any, infer Payload> // eslint-disable-line @typescript-eslint/no-explicit-any
  ? (payload: MaybeOptional<Payload>) => void
  : never;

interface SliceAt<S extends Entity> {
  /**
   * Creates a slice of `state` that proxies methods for convenience.
   * @example
   * store
   *   .slice('foo')
   *   .subscribe(foo => console.log(foo));
   */
  <A extends keyof S>(a: A): Slice<S[A]>;

  /**
   * Creates a slice of `state` that proxies methods for convenience.
   * @example
   * store
   *   .slice('foo', 'bar')
   *   .subscribe(bar => console.log(bar));
   */
  <A extends keyof S, B extends keyof S[A]>(a: A, b: B): Slice<S[A][B]>;

  /**
   * Creates a slice of `state` that proxies methods for convenience.
   * @example
   * store
   *   .slice('foo', 'bar', 'zed')
   *   .subscribe(zed => console.log(zed));
   */
  <A extends keyof S, B extends keyof S[A], C extends keyof S[A][B]>(
    a: A,
    b: B,
    c: C
  ): Slice<S[A][B][C]>;

  /**
   * Creates a slice of `state` that proxies methods for convenience.
   * @example
   * store
   *   .slice('foo', 'bar', 'zed', 'yoo')
   *   .subscribe(yoo => console.log(yoo));
   */
  <
    A extends keyof S,
    B extends keyof S[A],
    C extends keyof S[A][B],
    D extends keyof S[A][B][C]
  >(
    a: A,
    b: B,
    c: C,
    d: D
  ): Slice<S[A][B][C][D]>;

  /**
   * Creates a slice of `state` that proxies methods for convenience.
   * @example
   * store
   *   .slice('foo', 'bar', 'zed', 'yoo', 'lab')
   *   .subscribe(lab => console.log(lab));
   */
  <
    A extends keyof S,
    B extends keyof S[A],
    C extends keyof S[A][B],
    D extends keyof S[A][B][C],
    E extends keyof S[A][B][C][D]
  >(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E
  ): Slice<S[A][B][C][D][E]>;
}
