describe('config', () => {
  beforeEach(jest.resetModules);

  it('should use `NODE_ENV` for `mode`', async () => {
    const mode = 'test';
    process.env.NODE_ENV = mode;
    const { config } = await import('./config');

    expect(config.mode).toBe(mode);
  });

  it('should ignore unsupported modes and default to "production"', async () => {
    process.env.NODE_ENV = '';
    const { config } = await import('./config');

    expect(config.mode).toBe('production');
  });
});
