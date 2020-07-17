import React, { createContext } from 'react';
import type { Store } from '../createStore';
import type { Entity } from '../shared.types';
import { createHooks } from './createHooks';

/**
 * Creates a React.Context for the Store and hooks bound to it.
 * @param store Store to create Context for and bind hooks to.
 * @example
 * const { StoreProvider, useStore } = createStoreContext(store);
 */
export function createStoreContext<State extends Entity>(store: Store<State>) {
  const StoreContext = createContext(store);

  const { useStore } = createHooks(StoreContext);

  /**
   * Provides the store used previously with `createStoreContext(store)`.
   */
  const StoreProvider = ({ children }: { children: React.ReactNode }) => (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );

  return { StoreProvider, useStore };
}
