import type { Entity } from '../shared.types';

/**
 * Creates a context that can create tuple paths for `T`.
 * @note Useful while TypeScript is bad at tuple path inference/suggestion.
 * @example
 * interface State {
 *   foo: { bar: number; }
 * }
 *
 * my<State>().at('foo', 'bar');
 * // ['foo', 'bar']
 */
export function my<State extends Entity>(): My<State> {
  const at = (...path: ReadonlyArray<string>) => path;

  return { at } as My<State>;
}

interface My<State> {
  at: At<State>;
}

interface At<S> {
  /**
   * Creates strongly-typed `Array<key>` paths for `State`.
   * @example
   * at('foo');
   * // ['foo']
   */
  <A extends keyof S>(a: A): [A];

  /**
   * Creates strongly-typed `Array<key>` paths for `State`.
   * @example
   * at('foo', 'bar');
   * // ['foo', 'bar']
   */
  <A extends keyof S, B extends keyof S[A]>(a: A, b: B): [A, B];

  /**
   * Creates strongly-typed `Array<key>` paths for `State`.
   * @example
   * at('foo', 'bar', 'zed');
   * // ['foo', 'bar', 'zed']
   */
  <A extends keyof S, B extends keyof S[A], C extends keyof S[A][B]>(
    a: A,
    b: B,
    c: C
  ): [A, B, C];

  /**
   * Creates strongly-typed `Array<key>` paths for `State`.
   * @example
   * at('foo', 'bar', 'zed', 'yoo');
   * // ['foo', 'bar', 'zed', 'yoo']
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
  ): [A, B, C, D];

  /**
   * Creates strongly-typed `Array<key>` paths for `State`.
   * @example
   * at('foo', 'bar', 'zed', 'yoo', 'lab');
   * // ['foo', 'bar', 'zed', 'yoo', 'lab']
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
  ): [A, B, C, D, E];
}
