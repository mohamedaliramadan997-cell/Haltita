import { render, screen } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { ar } from '@/i18n/ar';

import RootLayout from '../../../app/_layout';

jest.mock('expo-font', () => ({ useFonts: jest.fn(() => [true, null]) }));
jest.mock('expo-router', () => ({ Stack: jest.fn(() => null) }));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
jest.mock('@/content', () => ({ contentProblems: ['version: missing'] }));
jest.mock('@/i18n', () => ({
  initLanguage: jest.fn(() => Promise.resolve()),
  useI18n: () => ({ strings: jest.requireActual('@/i18n/ar').ar }),
}));

describe('RootLayout with invalid content', () => {
  it('shows the error screen instead of the app and hides the splash', async () => {
    await render(<RootLayout />);
    expect(screen.getByText(ar.contentError)).toBeTruthy();
    expect(Stack).not.toHaveBeenCalled();
    expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
  });
});
