import type { ar } from './ar';

export const en: Record<keyof typeof ar, string> = {
  appName: 'Haltita',
  contentError: "There's a problem with the game data. Update the app and try again.",
  crashMessage: 'Something went wrong, sorry',
  backHome: 'Back to home',
  offline: 'Reconnecting…',
  hostAway: 'The host disconnected, waiting…',
};
