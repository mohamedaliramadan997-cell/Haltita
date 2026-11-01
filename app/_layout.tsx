import { Cairo_400Regular } from '@expo-google-fonts/cairo/400Regular';
import { Cairo_600SemiBold } from '@expo-google-fonts/cairo/600SemiBold';
import { Cairo_800ExtraBold } from '@expo-google-fonts/cairo/800ExtraBold';
import { Lalezar_400Regular } from '@expo-google-fonts/lalezar/400Regular';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { ContentErrorScreen } from '@/components/ui/ContentErrorScreen';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Toast } from '@/components/ui/Toast';
import { contentProblems } from '@/content';
import { initLanguage } from '@/i18n';
import { log } from '@/lib/logger';
import { fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.display]: Lalezar_400Regular,
    [fonts.body]: Cairo_400Regular,
    [fonts.bodySemiBold]: Cairo_600SemiBold,
    [fonts.bodyExtraBold]: Cairo_800ExtraBold,
  });
  // A font failure falls back to system fonts so the game stays playable.
  const fontsReady = fontsLoaded || fontError !== null;
  const [languageReady, setLanguageReady] = useState(false);
  const ready = fontsReady && languageReady;

  useEffect(() => {
    initLanguage().then(() => setLanguageReady(true));
    if (contentProblems.length > 0) log.error('Content validation failed', contentProblems);
  }, []);

  useEffect(() => {
    if (fontError) log.error('Font loading failed', fontError);
  }, [fontError]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  if (contentProblems.length > 0) return <ContentErrorScreen />;

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </ErrorBoundary>
  );
}
