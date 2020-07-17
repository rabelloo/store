import type { Reducer, Reducers } from '../shared.types';

/**
 * Registers `reducer` of `type` in `reducers`.
 * @param reducers Record of reducers indexed by type.
 * @param type Type of action to reduce.
 * @param reducer Function that takes in state and action to produce a new state.
 */
export function register<State, Payload>(
  reducers: Reducers<State>,
  type: string,
  reducer: Reducer<State, Payload>
) {
  if (reducers[type])
    throw new Error(
      `Store already has reducer for type (${type}). ` +
        `Choose another type when registering a reducer with '.on()'`
    );

  reducers[type] = reducer;
}
