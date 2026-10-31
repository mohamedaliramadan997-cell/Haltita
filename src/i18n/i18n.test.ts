import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook } from '@testing-library/react-native';
import { reloadAppAsync } from 'expo';
import { getLocales } from 'expo-localization';
import { I18nManager, Platform } from 'react-native';

import { formatNumber } from '@/lib/formatNumber';

import { initLanguage, setLanguage, useI18n, useLanguageStore } from './index';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo', () => ({ reloadAppAsync: jest.fn() }));
jest.mock('expo-localization', () => ({ getLocales: jest.fn() }));

const KEY = 'ht.language.v1';

const mockDevice = (languageCode: string) =>
  jest
    .mocked(getLocales)
    .mockReturnValue([{ languageCode }] as unknown as ReturnType<typeof getLocales>);
const mockIsRTL = (isRTL: boolean) => jest.replaceProperty(I18nManager, 'isRTL', isRTL);
const saved = (state: object) => AsyncStorage.setItem(KEY, JSON.stringify({ state, version: 0 }));
const language = async () => (await renderHook(() => useI18n())).result.current.language;

describe('formatNumber', () => {
  it('uses Arabic-Indic digits in Arabic', () => {
    expect(formatNumber(1234567890, 'ar')).toBe('١٢٣٤٥٦٧٨٩٠');
    expect(formatNumber(-1, 'ar')).toBe('-١');
  });

  it('keeps Western digits in English', () => {
    expect(formatNumber(120, 'en')).toBe('120');
  });
});

describe('language and direction', () => {
  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.spyOn(I18nManager, 'allowRTL').mockImplementation(() => {});
    jest.spyOn(I18nManager, 'forceRTL').mockImplementation(() => {});
    await AsyncStorage.clear();
    useLanguageStore.setState({ chosen: null, triedRTL: null });
    await AsyncStorage.clear();
    mockDevice('ar');
    mockIsRTL(true);
  });

  it.each([
    ['ar', 'ar'],
    ['en', 'en'],
    ['fr', 'ar'],
  ])('a %s device defaults to %s', async (device, expected) => {
    mockDevice(device);
    expect(await language()).toBe(expected);
  });

  it('a saved choice beats the device language', async () => {
    mockDevice('en');
    await saved({ chosen: 'ar', triedRTL: null });
    await initLanguage();
    expect(await language()).toBe('ar');
  });

  it('gives the strings of the current language', async () => {
    mockDevice('en');
    const { result } = await renderHook(() => useI18n());
    expect(result.current.strings.appName).toBe('Haltita');
    expect(result.current.formatNumber(5)).toBe('5');
  });

  it('does not restart when the direction already matches', async () => {
    await initLanguage();
    expect(I18nManager.forceRTL).not.toHaveBeenCalled();
    expect(reloadAppAsync).not.toHaveBeenCalled();
  });

  it('forces RTL and restarts when Arabic runs in LTR', async () => {
    mockIsRTL(false);
    await initLanguage();
    expect(I18nManager.allowRTL).toHaveBeenCalledWith(true);
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
    expect(reloadAppAsync).toHaveBeenCalledTimes(1);
  });

  it('disallows RTL when English runs on an RTL device', async () => {
    await setLanguage('en');
    expect(I18nManager.allowRTL).toHaveBeenCalledWith(false);
    expect(I18nManager.forceRTL).toHaveBeenCalledWith(false);
    expect(reloadAppAsync).toHaveBeenCalledTimes(1);
  });

  it('saves the choice before restarting', async () => {
    let storedAtRestart: string | null = null;
    jest.mocked(reloadAppAsync).mockImplementation(async () => {
      storedAtRestart = await AsyncStorage.getItem(KEY);
    });
    await setLanguage('en');
    expect(JSON.parse(storedAtRestart!).state).toEqual({ chosen: 'en', triedRTL: false });
  });

  it('never restarts twice for a direction the device ignores', async () => {
    mockIsRTL(false);
    await saved({ chosen: null, triedRTL: true });
    await initLanguage();
    expect(reloadAppAsync).not.toHaveBeenCalled();
  });

  it('clears the restart guard once the direction applied', async () => {
    await saved({ chosen: null, triedRTL: true });
    await initLanguage();
    expect(useLanguageStore.getState().triedRTL).toBeNull();
  });

  it('still opens when storage fails', async () => {
    mockIsRTL(false);
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('storage full'));
    await expect(initLanguage()).resolves.toBeUndefined();
    expect(reloadAppAsync).not.toHaveBeenCalled();
  });

  it('sets the document direction on web without restarting', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const documentElement = { dir: '', lang: '' };
    Object.defineProperty(globalThis, 'document', {
      value: { documentElement },
      configurable: true,
    });
    try {
      await setLanguage('en');
      expect(documentElement).toEqual({ dir: 'ltr', lang: 'en' });
      await setLanguage('ar');
      expect(documentElement).toEqual({ dir: 'rtl', lang: 'ar' });
      expect(reloadAppAsync).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(globalThis, 'document');
    }
  });
});
