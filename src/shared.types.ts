export interface Action<Payload = unknown> {
  payload?: Payload;
  type: string;
}

export type Dispatcher<Payload> = (payload: Payload) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Entity = Record<string, any>;

export type Index<T> = Record<string, T | undefined>;

export type Mode = 'production' | 'development' | 'test';

export type Reducer<State, Action> = (state: State, action: Action) => State;
export type Reducers<State> = Index<Reducer<State, unknown>>;

export type Subscription<State> = (state: State) => void;
export type Subscriptions<State> = Index<SubscriptionEntry<State>>;

interface SubscriptionEntry<State> {
  children: Set<string>;
  subscriptions: Set<Subscription<State>>;
}
