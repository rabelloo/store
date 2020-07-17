import type { Action, Entity } from '../shared.types';

export type Middleware<State extends Entity> = (_: {
  action: Action;
  from: string | symbol;
  nextState: State;
  state: State;
}) => State;
