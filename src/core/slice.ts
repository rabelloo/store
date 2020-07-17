import { mergeAt } from '../helpers/mergeAt';
import { path } from '../helpers/path';
import type {
  Action,
  Entity,
  Mode,
  Reducers,
  Subscriptions,
  Reducer,
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
  slicePath: Arr,
  mode: Mode,
  reducers: Reducers<Root>,
  subscriptions: Subscriptions<Root>,
  getState: () => Root,
  setState: (state: Root, action: Action, from: string | symbol) => void
): Slice<State> {
  const getSliceState = (state: Root) =>
    path(state, slicePath as [string]) as State;

  function sliceDispatch<Payload>(action: Action<Payload>) {
    let state: Root;
    try {
      state = dispatch(reducers, getState(), action);
    } catch (error) {
      if (mode === 'development') throw error;
      return;
    }

    setState(state, action, subscriptionKey(slicePath));
    notify(subscriptions, slicePath, state);
  }

  return {
    dispatch: sliceDispatch,
    on<Payload>(
      type: string,
      reducer: Reducer<State, Payload>
    ): (payload: Payload) => void {
      const proxy = (state: Root, payload: Payload) =>
        mergeAt(
          state,
          slicePath as [keyof Root],
          reducer(getSliceState(state), payload) as Root[keyof Root]
        );

      register(reducers, type, proxy);

      return (payload) => sliceDispatch({ payload, type });
    },
    get path() {
      return slicePath;
    },
    slice(...subPath: Arr) {
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
      const proxy = (state: Root) => subscription(getSliceState(state));

      return subscribe(subscriptions, slicePath, getState(), proxy);
    },
  };
}

type Arr = readonly string[];
