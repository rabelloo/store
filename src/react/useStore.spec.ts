import { useStore } from './useStore';
import type { Store } from '../createStore';
import { useContext, useMemo, useState, useEffect } from 'react';

jest.mock('react', () => {
  const setState = jest.fn();

  return {
    useContext: jest.fn(() => ({})),
    useEffect: jest.fn(),
    useMemo: jest.fn((fn: any) => fn()),
    useState: jest.fn((state: any) => [state, setState]),
  };
});

describe('useStore', () => {
  const StoreContext = {} as React.Context<Store<State>>;

  it('should return a tuple of [ state, dispatcher ]', () => {
    const state = {};
    const store = { state };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const result = useStore(StoreContext, {});

    expect(result[0]).toBe(state);
    expect(result[1]).toStrictEqual(expect.any(Function));
  });

  it('should have a dispatcher that does nothing when no matcher is specified', () => {
    const [, dispatch] = useStore(StoreContext, {});

    expect(dispatch()).toBe(undefined);
  });

  it('should cache dispatchers', () => {
    const type = 'foo';
    const dispatcher = () => {};
    const dispatchers = { [type]: dispatcher };

    const result = useStore(StoreContext, dispatchers, {
      type,
      reduce: (a) => a,
    });

    expect(result[1]).toBe(dispatcher);
  });

  it('should create dispatcher with slice.on when not yet cached', () => {
    const type = 'foo';
    const reduce = (a: any) => a;
    const dispatcher = () => {};
    const store = { on: jest.fn(() => dispatcher) };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const result = useStore(StoreContext, {}, { type, reduce });

    expect(result[1]).toBe(dispatcher);
    expect(store.on).toBeCalledWith(type, reduce);
  });

  it('should accept a selector', () => {
    const state = {};

    const result = useStore(StoreContext, {}, () => state);

    expect(result[0]).toBe(state);
  });

  it('should accept a matcher without slice', () => {
    const state = {};
    const type = 'foo';
    const reduce = (a: any) => a;
    const store = { on: () => {}, state };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const result = useStore(StoreContext, {}, { type, reduce });

    expect(result[0]).toBe(state);
  });

  it('should accept a matcher with slice', () => {
    const state = {};
    const type = 'foo';
    const reduce = (a: any) => a;
    const path = ['foo'] as any;
    const slice = { on: () => {}, state };
    const store = { slice: jest.fn(() => slice) };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    const result = useStore(StoreContext, {}, { type, reduce, slice: path });

    expect(result[0]).toBe(state);
    expect(store.slice).toBeCalledWith(...path);
  });

  it('should useContext', () => {
    useStore(StoreContext, {});

    expect(useContext).toBeCalledWith(StoreContext);
  });

  it('should useMemo the overload management', () => {
    const store = {};
    (useContext as jest.Mock).mockReturnValueOnce(store);

    useStore(StoreContext, {});

    expect(useMemo).toBeCalledWith(expect.any(Function), [store]);
  });

  it('should useState with the inital slice.state', () => {
    const state = {};
    const store = { state };
    (useContext as jest.Mock).mockReturnValueOnce(store);

    useStore(StoreContext, {});

    expect(useState).toBeCalledWith(state);
  });

  it('should useEffect to subscribe to slice and setState on changes', () => {
    let effect = () => {};
    let subscription = (_: unknown) => {};
    const unsub = {};
    const state = {};
    const [, setState] = useState();
    const store = {
      subscribe: jest.fn((subs) => {
        subscription = subs;
        return unsub;
      }),
    };
    (useContext as jest.Mock).mockReturnValueOnce(store);
    (useEffect as jest.Mock).mockImplementationOnce((fn) => {
      effect = fn;
    });
    useStore(StoreContext, {});

    const unsubscribe = effect();
    subscription(state);

    expect(unsubscribe).toBe(unsub);
    expect(useEffect).toBeCalledWith(effect, [store]);
    expect(setState).toBeCalledWith(state);
  });
});

interface State {
  foo: string;
}
