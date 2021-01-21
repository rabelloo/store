import type { Store } from '../createStore';
import type { Entity, Immutable } from '../shared.types';
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
  return {
    useStore: ((arg?: Arg<State>) =>
      useStore(StoreContext, arg)) as UseStore<State>,
  };
}

type Arg<State extends Entity> =
  | ((state: Immutable<State>) => unknown)
  | Matcher<State, unknown>;
