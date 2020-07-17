import { mergeAt } from './mergeAt';

describe('mergeAt', () => {
  it('should merge object with value at path', () => {
    const obj = { a: 1, foo: { b: 2, bar: 5 } };
    const path = ['foo', 'bar'];
    const value = 50;

    const result = mergeAt(obj, path as any, value);

    expect(result).toStrictEqual({
      ...obj,
      foo: {
        ...obj.foo,
        bar: value,
      },
    });
  });

  it('should return the value if path is empty', () => {
    const obj = {};
    const value = null;

    const result = mergeAt(obj, [] as any, value as never);

    expect(result).toBe(value);
  });
});
