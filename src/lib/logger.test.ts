import { log } from './logger';

describe('log', () => {
  const globals = globalThis as unknown as { __DEV__: boolean };

  afterEach(() => {
    globals.__DEV__ = true;
    jest.restoreAllMocks();
  });

  it.each(['info', 'warn', 'error'] as const)(
    'prints %s to the console in development',
    (level) => {
      const print = jest.spyOn(console, level).mockImplementation(() => {});
      const detail = new Error('boom');
      log[level]('message', detail);
      expect(print).toHaveBeenCalledWith('message', detail);
    },
  );

  it('prints nothing outside development', () => {
    const print = jest.spyOn(console, 'error').mockImplementation(() => {});
    globals.__DEV__ = false;
    log.error('message');
    expect(print).not.toHaveBeenCalled();
  });
});
