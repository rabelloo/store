import { createHooks } from './createHooks';
import { useStore } from './useStore';

jest.mock('./useStore', () => ({ useStore: jest.fn((a: any) => a) }));

describe('createHooks', () => {
  it('should return an object like { useStore }', () => {
    const result = createHooks({} as any);

    expect(result).toStrictEqual({ useStore: expect.any(Function) });
  });

  describe('useStore', () => {
    it('should simply proxy a call to ./useStore', () => {
      const StoreContext = {};
      const arg = () => {};
      const hooks = createHooks(StoreContext as any);

      const result = hooks.useStore(arg);

      expect(result).toBe(StoreContext);
      expect(useStore).toBeCalledWith(StoreContext, arg);
    });
  });
});
