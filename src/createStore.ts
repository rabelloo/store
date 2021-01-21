import { config } from './config';
import { slice } from './core/slice';
import type { Slice } from './core/slice.type';
import { freeze } from './middleware/freeze';
import { logger } from './middleware/logger';
import type { Middleware } from './middleware/middleware.type';
import type {
  Entity,
  Immutable,
  Mode,
  Reducers,
  Subscriptions,
} from './shared.types';

/**
 * Creates a new `Store` for state that can be subscribed for changes,
 * updated by dispatching actions,
 * and sliced for discriminate management.
 *
 * @param initialState State to initialize the store with.
 * @param config Optional configuration which changes store behaviour.
 * @example
 * createStore({ foo: 'bar' });
 */
export function createStore<State extends Entity>(
  initialState: Immutable<State>,
  {
    mode = config.mode,
    middleware = mode === 'development' ? [logger(), freeze()] : [],
  }: Config<State> = {}
): Store<State> {
  let state: Immutable<State>;
  const reducers: Reducers<State> = {};
  const subscriptions: Subscriptions<State> = {};

  const store = slice(
    [],
    mode,
    reducers,
    subscriptions,
    () => state,
    (value, action, from) => {
      state = middleware.reduce(
        (nextState, nextMiddleware) =>
          nextMiddleware({ action, from, nextState, state }),
        value
      );
    }
  );

  const init = store.on('@store init', (_, state: Immutable<State>) => state);

  init(initialState as never);

  return store;
}

export type Store<State extends Entity> = Slice<State>;

interface Config<State extends Entity> {
  middleware?: Middleware<State>[];
  mode?: Mode;
}
