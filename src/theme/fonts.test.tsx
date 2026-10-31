import { render } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import RootLayout from '../../app/_layout';

import { fonts } from './typography';

jest.mock('expo-font', () => ({ useFonts: jest.fn() }));
jest.mock('expo-router', () => ({ Stack: jest.fn(() => null) }));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

const mockFonts = (loaded: boolean, error: Error | null) =>
  jest.mocked(useFonts).mockReturnValue([loaded, error]);

describe('RootLayout fonts and splash', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loads every font token', async () => {
    mockFonts(true, null);
    await render(<RootLayout />);
    expect(Object.keys(jest.mocked(useFonts).mock.lastCall![0] as object).sort()).toEqual(
      Object.values(fonts).sort(),
    );
  });

  it('keeps the splash up and renders nothing while fonts load', async () => {
    mockFonts(false, null);
    await render(<RootLayout />);
    expect(Stack).not.toHaveBeenCalled();
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
  });

  it('hides the splash and renders the app once fonts load', async () => {
    mockFonts(true, null);
    await render(<RootLayout />);
    expect(Stack).toHaveBeenCalled();
    expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('still opens the app if fonts fail, so the splash never sticks', async () => {
    mockFonts(false, new Error('font failed'));
    await render(<RootLayout />);
    expect(Stack).toHaveBeenCalled();
    expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
  });
});
