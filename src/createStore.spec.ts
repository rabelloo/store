import { createStore } from './createStore';
import { slice } from './core/slice';
import { freeze } from './middleware/freeze';
import { logger } from './middleware/logger';
import { config } from './config';

jest.mock('./config', () => ({ config: { mode: 'test' } }));
jest.mock('./core/slice', () => ({ slice: jest.fn() }));
jest.mock('./middleware/freeze', () => ({ freeze: jest.fn() }));
jest.mock('./middleware/logger', () => ({ logger: jest.fn() }));

describe('createStore', () => {
  it('should return the result of slice()', () => {
    const mockSlice = { on: () => () => {} };
    (slice as jest.Mock).mockReturnValueOnce(mockSlice);

    const result = createStore({});

    expect(result).toBe(mockSlice);
  });

  it('should init the store with the provided initialState', () => {
    let init = (_: any, a: any) => a;
    const initialState = {};
    const dispatcher = jest.fn();
    const mockSlice = {
      on: jest.fn((_: string, initFn: <T>(t: T) => T) => {
        init = initFn;
        return dispatcher;
      }),
    };
    (slice as jest.Mock).mockReturnValueOnce(mockSlice);

    createStore(initialState);

    expect(mockSlice.on).toBeCalledWith('@store init', init);
    expect(init(null, initialState)).toBe(initialState);
    expect(dispatcher).toBeCalledWith(initialState);
  });

  it('should call slice() with the correct arguments', () => {
    const mode = 'test';
    const mockSlice = { on: () => () => {} };
    (slice as jest.Mock).mockReturnValue(mockSlice);

    createStore({}, { mode });

    const anyFn = expect.any(Function);
    expect(slice).toBeCalledWith([], mode, {}, {}, anyFn, anyFn);
  });

  it('should apply middleware on setState()', () => {
    let getState = () => ({});
    let setState = (..._: any[]) => {};
    const nextState = {};
    const action = {};
    const from = '~foo';
    const mode = 'production';
    const middleware = [(arg: any) => arg] as any;
    const mockSlice = { on: () => () => {} };
    (slice as jest.Mock).mockImplementationOnce((...args) => {
      getState = args[4];
      setState = args[5];
      return mockSlice;
    });
    createStore({}, { mode, middleware });
    const state = getState();

    setState(nextState, action, from);
    const result = getState();

    expect(result).toStrictEqual({ action, from, nextState, state });
  });

  it('should have some config defaults', () => {
    const mode = 'development';
    const mockSlice = { on: () => () => {} };
    (slice as jest.Mock).mockReturnValueOnce(mockSlice);
    (config as { mode: string }).mode = mode;

    createStore({});

    const any = expect.anything();
    expect(slice).toBeCalledWith(any, mode, any, any, any, any);
    expect(freeze).toBeCalledTimes(1);
    expect(logger).toBeCalledTimes(1);
  });
});
