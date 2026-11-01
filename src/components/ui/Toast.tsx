import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { colors, radius, screenPadding, spacing, typography } from '@/theme';

const TOAST_DURATION_MS = 2500;

// An object, not the bare string, so showing the same message again restarts the timer.
const useToastStore = create<{ toast: { message: string } | null }>(() => ({ toast: null }));

export function showToast(message: string): void {
  useToastStore.setState({ toast: { message } });
}

/** Mounted once in the root layout; the latest `showToast` replaces the current toast. */
export function Toast() {
  const toast = useToastStore((state) => state.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => useToastStore.setState({ toast: null }), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <SafeAreaView edges={['top']} pointerEvents="none" style={styles.overlay}>
      <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.toast}>
        <Text style={styles.message}>{toast.message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: spacing.sm,
  },
  toast: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
  },
  message: {
    ...typography.bodyLg,
    color: colors.textOnLight,
    textAlign: 'center',
  },
});
