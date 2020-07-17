import type { Store } from '../createStore';
import type { Dispatcher, Entity, Index } from '../shared.types';
import type { Matcher } from './matcher.type';
import { useStore } from './useStore';
import type { UseStore } from './useStore.type';

/**
 * Creates hooks especifically bound to the provided StoreContext.
 * @param StoreContext StoreContext to bind hooks to.
 */
export function createHooks<State extends Entity>(
  StoreContext: React.Context<Store<State>>
) {
  const dispatchers: Index<Dispatcher<unknown>> = {};

  return {
    useStore: ((arg: Arg<State>) =>
      useStore(StoreContext, dispatchers, arg)) as UseStore<State>,
  };
}

type Arg<State extends Entity> =
  | ((state: State) => unknown)
  | Matcher<State, unknown>
  | undefined;
