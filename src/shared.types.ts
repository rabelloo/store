export interface Action<Payload = unknown> {
  readonly payload?: Immutable<Payload>;
  readonly type: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Entity = Record<string, any>;

export type Immutable<T> = T extends Array<infer Entry>
  ? ReadonlyArray<Immutable<Entry>>
  : T extends Map<infer Key, infer Value>
  ? ReadonlyMap<Immutable<Key>, Immutable<Value>>
  : T extends Set<infer Entry>
  ? ReadonlySet<Immutable<Entry>>
  : T extends Entity
  ? { readonly [P in keyof T]: Immutable<T[P]> }
  : T;

export type Index<T> = Record<string, T | undefined>;

export type MaybeOptional<T> = T extends undefined ? T | void : T;

export type Mode = 'production' | 'development' | 'test';

export type Reducer<State, Payload> = (
  state: Immutable<State>,
  payload: Payload
) => Immutable<State>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Reducers<State> = Index<Reducer<State, any>>;

export type Subscription<State> = (state: Immutable<State>) => void;
export type Subscriptions<State> = Index<SubscriptionEntry<State>>;

interface SubscriptionEntry<State> {
  readonly children: Set<string>;
  readonly subscriptions: Set<Subscription<State>>;
}
