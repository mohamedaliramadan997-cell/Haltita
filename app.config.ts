import type { ExpoConfig } from 'expo/config';

import { palette } from './src/theme/colors.ts';

// Permanent app ID (T-001): iOS bundle ID and Android package. Never change it after the first store upload.
const APP_ID = 'com.mali.haltita';

const config: ExpoConfig = {
  name: 'حالتيتا',
  slug: 'haltita',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'haltita',
  userInterfaceStyle: 'dark',
  ios: {
    bundleIdentifier: APP_ID,
    supportsTablet: false,
  },
  android: {
    package: APP_ID,
    adaptiveIcon: {
      backgroundColor: palette.plum900,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    ['expo-localization', { supportedLocales: ['ar', 'en'] }],
    [
      'expo-splash-screen',
      {
        backgroundColor: palette.plum900,
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
