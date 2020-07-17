import { my } from './my';

describe('my', () => {
  it('should return an object like { at }', () => {
    const result = my();

    expect(result).toStrictEqual({ at: expect.any(Function) });
  });

  describe('at', () => {
    it('should return all arguments as an array', () => {
      const args = ['foo', 'bar'] as const;

      const result = my().at(...args);

      expect(result).toStrictEqual(args);
    });
  });
});
