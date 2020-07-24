import type { Action, Entity, Immutable } from '../shared.types';

export type Middleware<State extends Entity> = (_: {
  action: Action;
  from: string | symbol;
  nextState: Immutable<State>;
  state: Immutable<State>;
}) => Immutable<State>;
