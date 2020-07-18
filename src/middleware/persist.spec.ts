import { persist as persistMiddleware } from './persist';

describe('persist', () => {
  const appId = 'test persist';
  const id = `@store ${appId}`;
  const initType = '@store init';
  const persist = persistMiddleware(appId);
  global.localStorage = { getItem: jest.fn(), setItem: jest.fn() } as any;

  it('should hydrate on @store init', () => {
    const action = { type: initType };
    const init = { foo: 'bar' };
    const hydrate = JSON.stringify(init);
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(hydrate);

    const result = persist({ action } as any);

    expect(result).toEqual(init);
    expect(localStorage.getItem).toBeCalledWith(id);
  });

  it('should use nextState on @store init if hydration is null', () => {
    const action = { type: initType };
    const nextState = {};

    const result = persist({ action, nextState } as any);

    expect(result).toEqual(nextState);
  });

  it('should persist nextState on any other action', () => {
    const action = { type: 'foo' };
    const nextState = { foo: 'bar' };

    const result = persist({ action, nextState } as any);

    expect(result).toEqual(nextState);
    expect(localStorage.setItem).toBeCalledWith(id, JSON.stringify(nextState));
  });
});
