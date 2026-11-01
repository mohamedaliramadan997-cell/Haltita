type LogMethod = (message: string, ...details: unknown[]) => void;

// shortcut: production logs go nowhere yet, T-081 sends them to Sentry with scrubbing (rules.md §6).
const logTo =
  (method: 'info' | 'warn' | 'error'): LogMethod =>
  (message, ...details) => {
    if (__DEV__) console[method](message, ...details);
  };

export const log = {
  info: logTo('info'),
  warn: logTo('warn'),
  error: logTo('error'),
};
