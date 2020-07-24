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
export function my<T extends Entity>(): My<T> {
  const at = (...path: ReadonlyArray<string>) => path;

  return { at } as My<T>;
}

interface My<S> {
  at: At<S>;
}

interface At<S> {
  <A extends keyof S>(a: A): [A];

  <A extends keyof S, B extends keyof S[A]>(a: A, b: B): [A, B];

  <A extends keyof S, B extends keyof S[A], C extends keyof S[A][B]>(
    a: A,
    b: B,
    c: C
  ): [A, B, C];

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
