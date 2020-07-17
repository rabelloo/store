import type { Subscription, Subscriptions } from '../shared.types';
import { subscriptionKey } from './subscriptionKey';

/**
 * Subscribes to state changes with `subscription`.
 * @param subscriptions Record of subscriptions indexed by path.
 * @param path Path to subscribe in.
 * @param state Current state to immediately call `subscription` with.
 * @param subscription Function to execute on state changes.
 */
export function subscribe<State>(
  subscriptions: Subscriptions<State>,
  path: Arr,
  state: State,
  subscription: Subscription<State>
) {
  // immediately notify of current state
  subscription(state);

  // subscribe at exact path
  const { entry, key } = get(subscriptions, path);
  entry.subscriptions.add(subscription);

  // associate to parents for future state change notification
  const walk = [...path];
  while (walk.pop()) {
    const { entry: parent } = get(subscriptions, walk);
    parent.children.add(key);
  }

  // unsubscribe function
  return () => entry.subscriptions.delete(subscription);
}

function get<State>(subscriptions: Subscriptions<State>, path: Arr) {
  const key = subscriptionKey(path) as string;

  // TODO: refactor to ??= in TypeScript 4.0
  const entry =
    subscriptions[key] ??
    (subscriptions[key] = { children: new Set(), subscriptions: new Set() });

  return { entry, key };
}

type Arr = readonly string[];
