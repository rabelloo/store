/**
 * Determines the key of a `path` that will index a set of subscriptions.
 * @param path Path to generate key from.
 */
export function subscriptionKey(path: Arr) {
  return path.join('.') || root;
}

const root = Symbol('@store root');

type Arr = readonly string[];
