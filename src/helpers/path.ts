import type { Entity } from '../shared.types';

/**
 * Retrieves the value at a given path.
 * @param object Object to traverse.
 * @param path Path to go down.
 */
export const path: Path = (object: Entity, path: string[]) =>
  path.reduce((next, key) => next[key], object);

interface Path {
  /**
   * Retrieves the value at a given path.
   * @param object Object to traverse.
   * @param path Path to go down.
   */
  <O extends Entity, A extends keyof O>(object: O, path: [A]): O[A];

  /**
   * Retrieves the value at a given path.
   * @param object Object to traverse.
   * @param path Path to go down.
   */
  <O extends Entity, A extends keyof O, B extends keyof O[A]>(
    object: O,
    path: [A, B]
  ): O[A][B];

  /**
   * Retrieves the value at a given path.
   * @param object Object to traverse.
   * @param path Path to go down.
   */
  <
    O extends Entity,
    A extends keyof O,
    B extends keyof O[A],
    C extends keyof O[A][B]
  >(
    object: O,
    path: [A, B, C]
  ): O[A][B][C];

  /**
   * Retrieves the value at a given path.
   * @param object Object to traverse.
   * @param path Path to go down.
   */
  <
    O extends Entity,
    A extends keyof O,
    B extends keyof O[A],
    C extends keyof O[A][B],
    D extends keyof O[A][B][C]
  >(
    object: O,
    path: [A, B, C, D]
  ): O[A][B][C][D];

  /**
   * Retrieves the value at a given path.
   * @param object Object to traverse.
   * @param path Path to go down.
   */
  <
    O extends Entity,
    A extends keyof O,
    B extends keyof O[A],
    C extends keyof O[A][B],
    D extends keyof O[A][B][C],
    E extends keyof O[A][B][C][D]
  >(
    object: O,
    path: [A, B, C, D, E]
  ): O[A][B][C][D][E];
}
