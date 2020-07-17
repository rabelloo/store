import { subscribe } from './subscribe';
import type { Subscriptions } from '../shared.types';
import { subscriptionKey } from './subscriptionKey';

jest.mock('./subscriptionKey', () => ({
  subscriptionKey: jest.fn((path: string[]) => path.join('.') || '~root'),
}));

describe('subscribe', () => {
  const path = ['foo', 'bar'] as const;
  const key = subscriptionKey(path) as 'foo.bar';

  const createSubs = (key: string): Subscriptions<any> => ({
    [key]: {
      children: new Set(),
      subscriptions: new Set(),
    },
  });

  it('should immediately call subscription with current state', () => {
    const state = {};
    const subscription = jest.fn();
    const subscriptions = createSubs(key);

    subscribe(subscriptions, path, state, subscription);

    expect(subscription).toBeCalledWith(state);
  });

  it(`should add subscription to subscriptions Set`, () => {
    const subscription = jest.fn();
    const subscriptions = createSubs(key);

    subscribe(subscriptions, path, {}, subscription);

    const entry = subscriptions[key];
    expect(entry?.subscriptions.size).toBe(1);
    expect(entry?.subscriptions.has(subscription)).toBe(true);
  });

  it(`should add key to all parents' children Set`, () => {
    const subscription = jest.fn();
    const subscriptions = createSubs(key);

    subscribe(subscriptions, path, {}, subscription);

    // delete entry at `key`, we don't want to check it
    delete subscriptions[key];
    // then check all the rest
    Object.values(subscriptions).forEach((entry) => {
      expect(entry?.children.size).toBe(1);
      expect(entry?.children.has(key)).toBe(true);
    });
  });

  it('should create Sets if undefined', () => {
    const key = 'foo.bar';
    const path = key.split('.');
    const subscription = jest.fn();
    const subscriptions = {} as Subscriptions<any>;

    subscribe(subscriptions, path, {}, subscription);

    const entry = subscriptions[key];
    expect(entry?.children).toStrictEqual(expect.any(Set));
    expect(entry?.subscriptions).toStrictEqual(expect.any(Set));
  });

  describe('unsubscribe', () => {
    it('should remove from subscriptions Set ', () => {
      const subscription = jest.fn();
      const subscriptions = createSubs(key);

      const unsubscribe = subscribe(subscriptions, path, {}, subscription);
      const entry = subscriptions[key];
      expect(entry?.subscriptions.size).toBe(1);
      unsubscribe();

      expect(entry?.subscriptions.size).toBe(0);
    });

    it(`should not remove from parent's children Set `, () => {
      const subscription = jest.fn();
      const subscriptions = createSubs(key);

      const unsubscribe = subscribe(subscriptions, path, {}, subscription);
      // delete entry at `key`, we don't want to check it
      delete subscriptions[key];
      Object.values(subscriptions).forEach((entry) => {
        expect(entry?.children.size).toBe(1);
      });
      unsubscribe();

      Object.values(subscriptions).forEach((entry) => {
        expect(entry?.children.size).toBe(1);
      });
    });
  });
});
