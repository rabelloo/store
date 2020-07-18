import { Middleware } from './middleware.type';

/**
 * Middleware that persists state to localStorage.
 * @param appId Unique id to ensure it doesn't clash with other apps.
 */
export function persist<State>(appId: string): Middleware<State> {
  const id = `@store ${appId}`;
  const init = () => JSON.parse(localStorage.getItem(id) ?? 'null');

  return ({ action, nextState }) => {
    if (action.type === '@store init') return init() ?? nextState;

    localStorage.setItem(id, JSON.stringify(nextState));
    return nextState;
  };
}
