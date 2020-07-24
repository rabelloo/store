import type { Entity, Immutable } from '../shared.types';

/**
 * Merges `obj` at `path` with `value`.
 * @param obj Object to merge.
 * @param path Path to use `value`.
 * @param value Value to use at the end of `path`.
 * @example
 * const obj = { a: 1, foo: { b: 2, bar: 5 } };
 *
 * mergeAt(obj, ['foo', 'bar'], 30);
 * // { a: 1, foo: { b: 2, bar: 30 } }
 *
 * console.log(obj);
 * // { a: 1, foo: { b: 2, bar: 5 } }
 */
export const mergeAt: MergeAt = <T extends Entity>(
  obj: Immutable<T>,
  path: ReadonlyArray<string>,
  value: unknown
) => {
  if (!path.length) return value;

  const way = path.slice();
  const last = way.pop() as string;
  const clone = { ...obj };

  const cursor = way.reduce(
    (next, key) => (next[key] = { ...next[key] }),
    clone as Record<string, Record<string, unknown>>
  );

  cursor[last] = value;

  return clone;
};

interface MergeAt {
  /**
   * Merges `obj` at `path` with `value`.
   * @param obj Object to merge.
   * @param path Path to use `value`.
   * @param value Value to use at the end of `path`.
   * @example
   * const obj = { a: 1, foo: { b: 2, bar: 5 } };
   *
   * mergeAt(obj, ['foo', 'bar'], 30);
   * // { a: 1, foo: { b: 2, bar: 30 } }
   *
   * console.log(obj);
   * // { a: 1, foo: { b: 2, bar: 5 } }
   */
  <T extends Entity, A extends keyof T>(obj: T, path: [A], value: T[A]): T;

  <T extends Entity, A extends keyof T, B extends keyof T[A]>(
    obj: T,
    path: [A, B],
    value: T[A][B]
  ): T;

  <
    T extends Entity,
    A extends keyof T,
    B extends keyof T[A],
    C extends keyof T[A][B]
  >(
    obj: T,
    path: [A, B, C],
    value: T[A][B][C]
  ): T;

  <
    T extends Entity,
    A extends keyof T,
    B extends keyof T[A],
    C extends keyof T[A][B],
    D extends keyof T[A][B][C]
  >(
    obj: T,
    path: [A, B, C, D],
    value: T[A][B][C][D]
  ): T;

  <
    T extends Entity,
    A extends keyof T,
    B extends keyof T[A],
    C extends keyof T[A][B],
    D extends keyof T[A][B][C],
    E extends keyof T[A][B][C][D]
  >(
    obj: T,
    path: [A, B, C, D, E],
    value: T[A][B][C][D][E]
  ): T;

  /**
   * Untyped overload, prefer using another.
   */
  <T extends Entity>(obj: T, path: ReadonlyArray<string>, value: unknown): T;
}
