import type { Entity, Immutable } from '../shared.types';
import type { Middleware } from './middleware.type';

/**
 * Middleware that deeply freezes state and all objects and arrays in it.
 *
 * @note Recommended usage only in `development` mode.
 */
export function freeze<State>(): Middleware<State> {
  return ({ nextState }) => deepFreeze(nextState as State);
}

function deepFreeze<T>(value: T): Immutable<T> {
  if (!needsFreeze(value)) return value;

  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value) as Immutable<T>;
}

function needsFreeze(value: unknown): value is Entity | [] {
  return value instanceof Object;
}
