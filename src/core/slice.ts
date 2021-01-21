import { mergeAt } from '../helpers/mergeAt';
import { path } from '../helpers/path';
import type {
  Action,
  Entity,
  Immutable,
  Mode,
  Reducers,
  Subscriptions,
} from '../shared.types';
import { dispatch } from './dispatch';
import { notify } from './notify';
import { register } from './register';
import type { Slice } from './slice.type';
import { subscribe } from './subscribe';
import { subscriptionKey } from './subscriptionKey';

/**
 * Creates a slice of `@store` that proxies methods for convenience.
 * @note Meant for internal use, external API is `store.slice()`.
 * @param slicePath Path in the `@store` to the slice.
 * @param mode Execution mode, will throw errors if `development`.
 * @param reducers `@store` reducer Index.
 * @param subscriptions `@store` subscription Index.
 * @param getState `@store` readonly root state.
 * @param setState Function to update `@store` root state.
 */
export function slice<Root extends Entity, State extends Entity = Root>(
  slicePath: ReadonlyArray<string>,
  mode: Mode,
  reducers: Reducers<Root>,
  subscriptions: Subscriptions<Root>,
  getState: () => Immutable<Root>,
  setState: (
    state: Immutable<Root>,
    action: Action,
    from: string | symbol
  ) => void
): Slice<State> {
  const sliceKey = subscriptionKey(slicePath);

  const getSliceState = (state: Immutable<Root>) =>
    path(state, slicePath as [string]) as Immutable<State>;

  function sliceDispatch<Payload>(action: Action<Payload>) {
    let state: Immutable<Root>;
    try {
      state = dispatch(reducers, getState(), action);
    } catch (error) {
      if (mode === 'development') throw error;
      return;
    }

    setState(state, action, sliceKey);
    notify(subscriptions, slicePath, state);
  }

  return {
    dispatch: sliceDispatch,
    on(type, reducer) {
      type Payload = Parameters<typeof reducer>[1];

      const proxy = (state: Immutable<Root>, payload: Payload) =>
        mergeAt(state, slicePath, reducer(getSliceState(state), payload));

      register(reducers, type, proxy);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((payload: Payload) => sliceDispatch({ payload, type })) as any;
    },
    get path() {
      return slicePath;
    },
    slice(...subPath: ReadonlyArray<string>) {
      return slice(
        slicePath.concat(subPath),
        mode,
        reducers,
        subscriptions,
        getState,
        setState
      ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    get state() {
      return getSliceState(getState());
    },
    subscribe(subscription) {
      const proxy = (state: Immutable<Root>) =>
        subscription(getSliceState(state));

      return subscribe(subscriptions, slicePath, getState(), proxy);
    },
  };
}
