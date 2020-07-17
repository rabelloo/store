import { freeze as freezeMiddleware } from './freeze';

describe('freeze', () => {
  const freezer = freezeMiddleware<any>();
  const freeze = <T>(nextState: T): T => freezer({ nextState } as any);

  it('should transform objects into readonly', () => {
    const array = ['foo'];
    const object = { foo: 'bar' };

    const frozenArr = freeze(array);
    const frozenObj = freeze(object);

    expect(frozenArr).toBe(array);
    expect(frozenObj).toBe(object);
    expect(() => frozenArr.push('bar')).toThrow();
    expect(() => (frozenObj.foo = 'foo')).toThrow();
  });

  it('should work recursively/deeply', () => {
    const frozen = freeze({ foo: { bar: 'qwerty' } });

    expect(frozen.foo.bar).toBe('qwerty');
    expect(() => (frozen.foo.bar = 'foo')).toThrow();
  });

  it('should simply return immutable primitives', () => {
    const immutable = 'foo';

    const frozen = freeze(immutable);

    expect(frozen).toBe(immutable);
  });
});
