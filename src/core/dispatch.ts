import type { Action, Immutable, Reducers } from '../shared.types';

/**
 * Dispatches an `action` to the appropriate reducer according to `action.type`.
 * @param reducers Record of reducers indexed by action type.
 * @param state State to reduce.
 * @param action Action to reduce.
 * @throws When reducer for `action.type` is not found.
 */
export function dispatch<State, Payload>(
  reducers: Reducers<State>,
  state: Immutable<State>,
  action: Action<Payload>
) {
  const { payload, type } = action;
  const reduce = reducers[type];

  if (!reduce)
    throw new Error(
      `Action of type (${type}) was dispatched ` +
        `but no reducer was registered for it. ` +
        `Only thrown because your mode is "development".`
    );

  return reduce(state, payload);
}
