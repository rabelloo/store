import { createHooks } from './createHooks';
import { createStoreContext } from './createStoreContext';

jest.mock('react', () => ({
  createContext: (store: any) => ({
    Provider: ({ children }: any) => ({ children, store }),
  }),
  createElement: (el: any, props: any[], children: any) =>
    el({ ...props, children }),
}));
jest.mock('./createHooks', () => {
  const useStore = jest.fn();
  return { createHooks: jest.fn(() => ({ useStore })) };
});

describe('createStoreContext', () => {
  it('should return an object like { StoreProvider, useStore }', () => {
    const result = createStoreContext({} as any);

    expect(result).toStrictEqual({
      StoreProvider: expect.any(Function),
      useStore: createHooks({} as any).useStore,
    });
  });

  describe('StoreProvider', () => {
    it('should return a Provider with value={store} and {children}', () => {
      const children = {};
      const store = {};
      const { StoreProvider } = createStoreContext(store as any);

      const result = StoreProvider({ children });

      expect(result).toStrictEqual({ children, store });
    });
  });

  describe('useStore', () => {
    it('should be the strict return from `createHooks`', () => {
      const hooks = createHooks({} as any);

      const { useStore } = createStoreContext({} as any);

      expect(useStore).toBe(hooks.useStore);
    });
  });
});
