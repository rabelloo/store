import * as index from '.';

describe('index', () => {
  const anyFn = expect.any(Function);

  it('should export only external API', () => {
    expect(index).toEqual({
      createStore: anyFn,
      createStoreContext: anyFn,
      freeze: anyFn,
      logger: anyFn,
      my: anyFn,
      persist: anyFn,
    });
  });
});
