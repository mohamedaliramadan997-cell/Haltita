import AsyncStorage from '@react-native-async-storage/async-storage';
import { reloadAppAsync } from 'expo';
import { getLocales } from 'expo-localization';
import { I18nManager, Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { formatNumber } from '@/lib/formatNumber';

import { ar } from './ar';
import { en } from './en';

const strings = { ar, en };

export type Language = keyof typeof strings;

type LanguageState = {
  chosen: Language | null;
  // The direction the last restart tried to apply, so a device that ignores it can't restart forever.
  triedRTL: boolean | null;
};

// skipHydration: AsyncStorage needs `window` on web, which the static render doesn't have.
export const useLanguageStore = create<LanguageState>()(
  persist((): LanguageState => ({ chosen: null, triedRTL: null }), {
    name: 'ht.language.v1',
    storage: createJSONStorage(() => AsyncStorage),
    skipHydration: true,
  }),
);

// Arabic is the default for every device language except English.
const deviceLanguage = (): Language => (getLocales()[0]?.languageCode === 'en' ? 'en' : 'ar');

const currentLanguage = ({ chosen }: LanguageState): Language => chosen ?? deviceLanguage();

// React Native only applies a direction change after a restart.
async function applyDirection(language: Language): Promise<void> {
  const rtl = language === 'ar';

  if (Platform.OS === 'web') {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    return;
  }

  const { triedRTL } = useLanguageStore.getState();
  if (I18nManager.isRTL === rtl) {
    if (triedRTL !== null) await useLanguageStore.setState({ triedRTL: null });
    return;
  }
  if (triedRTL === rtl) return;

  // Both calls are needed: an Arabic device stays RTL unless RTL is also disallowed.
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  // persist's setState resolves when the write finishes (its type says void); wait so the restart can't lose it.
  await useLanguageStore.setState({ triedRTL: rtl });
  await reloadAppAsync('Language direction changed');
}

export async function initLanguage(): Promise<void> {
  try {
    await useLanguageStore.persist.rehydrate();
    await applyDirection(currentLanguage(useLanguageStore.getState()));
  } catch {
    // The app still opens, using the device language and the current direction.
    // shortcut: the failure isn't reported yet, send it to log.error at T-016.
  }
}

export async function setLanguage(language: Language): Promise<void> {
  await useLanguageStore.setState({ chosen: language });
  await applyDirection(language);
}

export function useI18n() {
  const language = useLanguageStore(currentLanguage);
  return {
    language,
    strings: strings[language],
    formatNumber: (value: number) => formatNumber(value, language),
  };
}
