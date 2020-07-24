import type { Immutable, Subscriptions } from '../shared.types';
import { subscriptionKey } from './subscriptionKey';

/**
 * Notifies all subscribers at the specified `path` of the `state`,
 * as well as its parents (see example).
 * @param subscriptions Record of subscriptions indexed by path.
 * @param path Path to notify.
 * @param state State to notify with.
 * @example
 * const state = {
 *   foo: {
 *     bar: 'Hello World',
 *   },
 * };
 *
 * const subscriptions: {
 *   'bar': {
 *     children: new Set(),
 *     subscriptions: new Set([() => console.log('notified bar')])
 *   },
 *   'foo': {
 *     children: new Set(['foo.bar']),
 *     subscriptions: new Set([() => console.log('notified foo')])
 *   },
 *   'foo.bar': {
 *     children: new Set([]),
 *     subscriptions: new Set([() => console.log('notified foo.bar')])
 *   },
 *   [Symbol('store/root')]: {
 *     children: new Set(['bar', 'foo', 'foo.bar']),
 *     subscriptions: new Set([() => console.log('notified store/root')])
 *   },
 * };
 *
 * notify(subscriptions, ['foo'], state);
 * // notified foo
 * // notified foo.bar
 * // notified store/root
 */
export function notify<State>(
  subscriptions: Subscriptions<State>,
  path: ReadonlyArray<string>,
  state: Immutable<State>
) {
  const entry = pathNotify(subscriptions, path, state);

  // notify all children
  entry?.children.forEach((childKey) =>
    entryNotify(subscriptions, childKey, state)
  );

  // notify all parents up to the root
  const parent = [...path];
  while (parent.pop()) {
    pathNotify(subscriptions, parent, state);
  }
}

function pathNotify<State>(
  subscriptions: Subscriptions<State>,
  path: ReadonlyArray<string>,
  state: Immutable<State>
) {
  const key = subscriptionKey(path) as string;

  return entryNotify(subscriptions, key, state);
}

function entryNotify<State>(
  subscriptions: Subscriptions<State>,
  key: string,
  state: Immutable<State>
) {
  const entry = subscriptions[key];

  entry?.subscriptions.forEach((send) => send(state));

  return entry;
}
