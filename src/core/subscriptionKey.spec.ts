import { subscriptionKey } from './subscriptionKey';

describe('subscriptionKey', () => {
  it('should return a string that identifies the path', () => {
    const key = 'foo.bar';
    const path = key.split('.');

    const result = subscriptionKey(path);

    expect(result).toBe(key);
  });

  it('should return a symbol for the root when the path is empty', () => {
    const result = subscriptionKey([]);

    expect(result.toString()).toBe('Symbol(@store root)');
  });
});
