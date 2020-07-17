import type { Subscriptions, Subscription } from '../shared.types';
import { notify } from './notify';
import { subscriptionKey } from './subscriptionKey';

jest.mock('./subscriptionKey', () => ({
  subscriptionKey: jest.fn((path: string[]) => path.join('.') || '~root'),
}));

describe('notify', () => {
  const path = ['foo', 'bar'] as const;
  const key = subscriptionKey(path) as 'foo.bar';

  const createSubs = (
    key: string,
    subscription: Subscription<any>
  ): Subscriptions<any> => ({
    [key]: {
      children: new Set(),
      subscriptions: new Set([subscription]),
    },
  });

  it('should notify direct path subscriptions with state', () => {
    const state = {};
    const subscription = jest.fn();
    const subscriptions = createSubs(key, subscription);

    notify(subscriptions, path, state);

    expect(subscription).toBeCalledWith(state);
  });

  it('should notify subscriptions "parent to path" after direct subs', () => {
    const state = {};
    const parentKey = path[0];
    const subscription = jest.fn();
    const subscriptions = {
      ...createSubs(key, (st) => subscription(key, st)),
      ...createSubs(parentKey, (st) => subscription(parentKey, st)),
    };

    notify(subscriptions, path, state);

    expect(subscription).nthCalledWith(1, key, state);
    expect(subscription).nthCalledWith(2, parentKey, state);
  });

  it('should notify children subscriptions after direct subs', () => {
    const state = {};
    const childKey = '~child';
    const subscription = jest.fn();
    const subscriptions = {
      ...createSubs(key, (st) => subscription(key, st)),
      ...createSubs(childKey, (st) => subscription(childKey, st)),
    };
    subscriptions[key]?.children.add(childKey);

    notify(subscriptions, path, state);

    expect(subscription).nthCalledWith(1, key, state);
    expect(subscription).nthCalledWith(2, childKey, state);
  });

  it('should not break when entry is not found', () => {
    const state = {};

    const act = () => notify({}, path, state);

    expect(act).not.toThrowError();
  });
});
