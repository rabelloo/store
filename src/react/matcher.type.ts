import type { Entity, Immutable } from '../shared.types';

export interface Matcher<
  State extends Entity,
  Payload,
  Path extends ReadonlyArray<Key> | undefined = undefined
> {
  /** A reducer that gets the action payload directly when the type matches. */
  readonly reduce: (
    state: Immutable<State>,
    payload: Immutable<Payload>
  ) => Immutable<State>;
  /** Path of the `@store` slice. */
  readonly slice?: Path;
  /** Type of action to reduce. */
  readonly type: string;
}

type Key = keyof any; // eslint-disable-line @typescript-eslint/no-explicit-any
