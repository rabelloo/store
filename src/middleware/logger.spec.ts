import { logger } from './logger';

describe('logger', () => {
  const log = logger();
  jest.spyOn(console, 'group').mockImplementation();
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(console, 'groupEnd').mockImplementation();

  it('should return the nextState unaltered', () => {
    const nextState = {};

    const result = log({ nextState } as any);

    expect(result).toBe(nextState);
  });

  it('should call several console methods to log information', () => {
    const action = { type: 'foo' };
    const from = Symbol('from');
    const state = {};
    const nextState = {};
    const before = 'color: rgb(227 133 25)';
    const diff = 'color: rgb(130 143 255)';
    const after = 'color: rgb(37 207 94)';

    log({ action, from, nextState, state });

    expect(console.group).toBeCalledWith('Store');
    expect(console.log).toBeCalledWith('%c Previous state', before, state);
    expect(console.log).toBeCalledWith('%c Action from', diff, from, action);
    expect(console.log).toBeCalledWith('%c Next state', after, nextState);
    expect(console.groupEnd).toBeCalled();
  });
});
