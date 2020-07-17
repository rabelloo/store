import type { Middleware } from './middleware.type';

/**
 * Middleware that logs every state change.
 *
 * @note Recommended usage only in `development` mode.
 */
export function logger<State>(): Middleware<State> {
  return ({ action, from, nextState, state }) => {
    console.group('Store');
    console.log('%c Previous state', before, state);
    console.log('%c Action from', diff, from, action);
    console.log('%c Next state', after, nextState);
    console.groupEnd();

    return nextState;
  };
}

const before = 'color: rgb(227 133 25)';
const diff = 'color: rgb(130 143 255)';
const after = 'color: rgb(37 207 94)';
