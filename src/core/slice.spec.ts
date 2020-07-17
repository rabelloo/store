import { path } from '../helpers/path';
import type {
  Action,
  Entity,
  Mode,
  Reducers,
  Subscriptions,
} from '../shared.types';
import { dispatch } from './dispatch';
import { notify } from './notify';
import { register } from './register';
import { slice } from './slice';
import { subscribe } from './subscribe';
import { subscriptionKey } from './subscriptionKey';
import { mergeAt } from '../helpers/mergeAt';

jest.mock('../helpers/mergeAt', () => ({ mergeAt: jest.fn((a: any) => a) }));
jest.mock('../helpers/path', () => ({ path: jest.fn((a: any) => a) }));
jest.mock('./dispatch', () => ({ dispatch: jest.fn() }));
jest.mock('./notify', () => ({ notify: jest.fn() }));
jest.mock('./register', () => ({ register: jest.fn() }));
jest.mock('./subscribe', () => ({ subscribe: jest.fn() }));
jest.mock('./subscriptionKey', () => ({
  subscriptionKey: jest.fn((path: string[]) => path.join('.') || '~root'),
}));

describe('slice', () => {
  const create = <State extends Entity>({
    state = {} as State,
    slicePath = [] as const,
    mode = 'development',
    reducers = {},
    subscriptions = {},
    getState = () => state,
    setState = (value: State) => (state = value),
  }: SliceConfig<State> = {}) =>
    slice(slicePath, mode, reducers, subscriptions, getState, setState);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a Slice', () => {
    const slice = create();

    expect(slice).toStrictEqual({
      dispatch: expect.any(Function),
      on: expect.any(Function),
      path: [],
      slice: expect.any(Function),
      state: {},
      subscribe: expect.any(Function),
    });
  });

  describe('dispatch', () => {
    const state = {};
    const getState = () => state;
    const setState = jest.fn();
    const type = 'foo';
    const action = { type };
    const reducers = {};
    const subscriptions = {};
    const slice = create({ getState, reducers, setState, subscriptions });

    it('should reduce with the appropriate type', () => {
      slice.dispatch(action);

      expect(dispatch).toBeCalledWith(reducers, getState(), action);
    });

    it('should setState with the result', () => {
      const newState = {};
      (dispatch as jest.Mock).mockReturnValueOnce(newState);

      slice.dispatch(action);

      expect(setState).toBeCalledWith(newState, action, subscriptionKey([]));
    });

    it('should notify subscriptions', () => {
      const newState = {};
      (dispatch as jest.Mock).mockReturnValueOnce(newState);

      slice.dispatch(action);

      expect(notify).toBeCalledWith(subscriptions, [], newState);
    });

    it('should throw error if mode is "development"', () => {
      const error = new Error('foo bar');
      (dispatch as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      const act = () => slice.dispatch(action);

      expect(act).toThrowError(error);
    });

    it('should catch errors if mode is not "development"', () => {
      const prodSlice = create({ mode: 'production' });
      (dispatch as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      const act = () => prodSlice.dispatch(action);

      expect(act).not.toThrowError();
    });
  });

  describe('on', () => {
    const type = 'foo';
    const slicePath = [] as const;
    const reducer = jest.fn((state: any) => state);
    const reducers = {};
    const slice = create({ slicePath, reducers });

    it('should register the specified type', () => {
      slice.on(type, reducer);

      expect(register).toBeCalledWith(reducers, type, expect.any(Function));
    });

    it('should use a proxy that merges the root state with the slice state after reducing', () => {
      const state = Symbol('state');
      const payload = Symbol('payload');
      let proxy = (_state: typeof state, _payload: typeof payload) => {};
      (mergeAt as jest.Mock).mockImplementationOnce(reducer);
      (register as jest.Mock).mockImplementationOnce(
        (_0, _1, prxy) => (proxy = prxy)
      );
      slice.on(type, reducer);

      const result = proxy(state, payload);

      expect(result).toBe(state);
      expect(mergeAt).toBeCalledWith(state, slicePath, state);
      expect(reducer).toBeCalledWith(state, payload);
    });

    it('should return a dispatcher of an action with type and payload specified', () => {
      const payload = {};
      const action = { type, payload };
      const dispatcher = slice.on(type, reducer);

      dispatcher(payload);

      expect(dispatch).toBeCalledWith(reducers, {}, action);
    });
  });

  describe('path', () => {
    it('should be the exact same as argument', () => {
      const slicePath = [] as const;

      const slice = create({ slicePath });

      expect(slice.path).toBe(slicePath);
    });
  });

  describe('slice', () => {
    it('should create a slice with the specified subPath', () => {
      const slicePath = ['foo'] as const;
      const subPath = ['bar', 'zed'] as const;

      const result = create({ slicePath }).slice(...subPath);

      expect(result.path).toStrictEqual([...slicePath, ...subPath]);
    });
  });

  describe('state', () => {
    it('should be the exact same as argument', () => {
      const state = {};

      const slice = create({ state });

      expect(slice.state).toBe(state);
    });
  });

  describe('subscribe', () => {
    const state = {};
    const getState = () => state;
    const subscription = (a: any) => a;
    const slicePath = [] as const;
    const subscriptions = {};

    it('should subscribe with a proxy', () => {
      const slice = create({ getState, slicePath, subscriptions });

      slice.subscribe(subscription);

      expect(subscribe).toBeCalledWith(
        subscriptions,
        slicePath,
        getState(),
        expect.any(Function)
      );
    });

    it('should use a proxy that calls the subscription with the slice state', () => {
      const slice = create({ getState, slicePath, subscriptions });
      (subscribe as jest.Mock).mockImplementationOnce(
        (_0, _1, _2, proxy) => proxy
      );
      const proxy = slice.subscribe(subscription) as (_: typeof state) => void;

      const result = proxy(state);

      expect(result).toBe(state);
      expect(path).toBeCalledWith(state, slicePath);
    });

    it('should return the unsubscribe function', () => {
      const unsub = {};
      const slice = create({ getState });
      (subscribe as jest.Mock).mockReturnValueOnce(unsub);

      const result = slice.subscribe(subscription);

      expect(result).toBe(unsub);
    });
  });
});

interface SliceConfig<State> {
  state?: State;
  slicePath?: readonly string[];
  mode?: Mode;
  reducers?: Reducers<State>;
  subscriptions?: Subscriptions<State>;
  getState?: () => State;
  setState?: (state: State, action: Action, from: string | symbol) => void;
}
