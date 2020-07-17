import { path } from './path';

describe('path', () => {
  it('should deeply access an object in the path order specified', () => {
    const bar = {};
    const obj = { foo: [{ bar }] };

    const result = path(obj, ['foo', '0', 'bar'] as any);

    expect(result).toBe(bar);
  });
});
