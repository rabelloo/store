const config = {
  get mode() {
    return jest.requireActual('./config').config.mode;
  },
};

describe('config', () => {
  beforeEach(jest.resetModules);

  it('should use `NODE_ENV` for `mode`', () => {
    const mode = 'test';
    process.env.NODE_ENV = mode;

    const result = config.mode;

    expect(result).toBe(mode);
  });

  it('should ignore unsupported modes and default to "production"', () => {
    const mode = 'foo';
    process.env.NODE_ENV = mode;

    const result = config.mode;

    expect(result).toBe('production');
  });
});
