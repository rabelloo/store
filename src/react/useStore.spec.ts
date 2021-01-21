import { useContext, useEffect, useMemo, useState } from 'react';
import type { Store } from '../createStore';
import { useStore } from './useStore';

jest.mock('react', () => {
  const setState = jest.fn();

  return {
    useContext: jest.fn(() => ({})),
    useEffect: jest.fn(),
    useMemo: jest.fn((fn: any) => fn()),
    useState: jest.fn((stateFn: any) => [stateFn?.(), setState]),
  };
});

describe('useStore', () => {
  const StoreContext = {} as React.Context<Store<State>>;

  beforeEach(jest.clearAllMocks);

  it('should return a tuple of [ state, dispatcher ]', () => {
    const state = {};
    const store = { state };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const result = useStore(StoreContext);

    expect(result[0]).toBe(state);
    expect(result[1]).toStrictEqual(expect.any(Function));
  });

  it('should have a dispatcher that does nothing when no matcher is specified', () => {
    const [, dispatch] = useStore(StoreContext);

    expect(dispatch()).toBe(undefined);
  });

  it('should maintain dispatcher reference', () => {
    const type = 'foo';

    const [, first] = useStore(StoreContext, { type, reduce: (a) => a });
    const [, second] = useStore(StoreContext, { type, reduce: (a) => a });

    expect(first).toBe(second);
  });

  it('should create dispatcher with slice.on', () => {
    const type = 'foo';
    const reduce = (a: any) => a;
    const dispatcher = () => {};
    const store = { on: jest.fn(() => () => dispatcher) };
    const [, setDispatcher] = useState();
    (useContext as jest.Mock).mockReturnValueOnce(store);
    (useEffect as jest.Mock).mockImplementationOnce((fn) => fn());

    const [, noop] = useStore(StoreContext, { type, reduce });
    const result = (setDispatcher as jest.Mock).mock.calls[0][0]();

    expect(result).toBe(dispatcher);
    expect(noop()).toBe(undefined);
    expect(store.on).toBeCalledWith(type, reduce);
  });

  it('should accept a selector', () => {
    const state = {};

    const [result] = useStore(StoreContext, () => state);

    expect(result).toBe(state);
  });

  it('should accept a matcher without slice', () => {
    const state = {};
    const type = 'foo';
    const reduce = (a: any) => a;
    const store = { on: () => {}, state };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const [result] = useStore(StoreContext, { type, reduce });

    expect(result).toBe(state);
  });

  it('should accept a matcher with slice', () => {
    const state = {};
    const type = 'foo';
    const reduce = (a: any) => a;
    const path = ['foo'] as any;
    const slice = { on: () => {}, state };
    const store = { slice: jest.fn(() => slice) };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const [result] = useStore(StoreContext, { type, reduce, slice: path });

    expect(result).toBe(state);
    expect(store.slice).toBeCalledWith(...path);
  });

  it('should useContext', () => {
    useStore(StoreContext);

    expect(useContext).toBeCalledWith(StoreContext);
  });

  it('should useMemo the overload management', () => {
    const store = {};
    (useContext as jest.Mock).mockReturnValueOnce(store);

    useStore(StoreContext);

    expect(useMemo).toBeCalledWith(expect.any(Function), []);
  });

  it('should useState with the inital slice.state', () => {
    const state = {};
    const store = { state };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    useStore(StoreContext);

    expect(useState).toBeCalledWith(expect.any(Function));
    const initFn = (useState as jest.Mock).mock.calls[0][0];
    expect(initFn()).toBe(state);
  });

  it('should useEffect to subscribe to slice and setState on changes', () => {
    const unsub = {};
    const state = {};
    const [, setState] = useState();
    const store = { subscribe: jest.fn().mockReturnValue(unsub) };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    useStore(StoreContext);

    const effect = (useEffect as jest.Mock).mock.calls[1][0];
    const unsubscribe = effect();

    const subscription = store.subscribe.mock.calls[0][0];
    subscription(state);

    expect(unsubscribe).toBe(unsub);
    expect(setState).toBeCalledWith(state);
  });
});

interface State {
  foo: string;
}
