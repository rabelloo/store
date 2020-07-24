export interface Action<Payload = unknown> {
  readonly payload?: Immutable<Payload>;
  readonly type: string;
}

export type Dispatcher<Payload> = (payload: Immutable<Payload>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Entity = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Immutable<T> = T extends object
  ? { readonly [P in keyof T]: Immutable<T[P]> }
  : T extends Array<infer Entry>
  ? ReadonlyArray<Immutable<Entry>>
  : T extends Map<infer Key, infer Value>
  ? ReadonlyMap<Immutable<Key>, Immutable<Value>>
  : T extends Set<infer Entry>
  ? ReadonlySet<Immutable<Entry>>
  : T;

export type Index<T> = Record<string, T | undefined>;

export type Mode = 'production' | 'development' | 'test';

export type Reducer<State, Payload> = (
  state: Immutable<State>,
  payload: Payload
) => Immutable<State>;
export type Reducers<State> = Index<Reducer<State, unknown>>;

export type Subscription<State> = (state: Immutable<State>) => void;
export type Subscriptions<State> = Index<SubscriptionEntry<State>>;

interface SubscriptionEntry<State> {
  readonly children: Set<string>;
  readonly subscriptions: Set<Subscription<State>>;
}
