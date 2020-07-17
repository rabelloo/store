import type { Entity } from '../shared.types';

export interface Matcher<
  State extends Entity,
  Payload,
  Path extends Arr | undefined = undefined
> {
  /** A reducer that gets the action payload directly when the type matches. */
  reduce: (state: State, payload: Payload) => State;
  /** Path of the `@store` slice. */
  slice?: Path;
  /** Type of action to reduce. */
  type: string;
}

type Arr = readonly Key[];
type Key = keyof any; // eslint-disable-line @typescript-eslint/no-explicit-any
