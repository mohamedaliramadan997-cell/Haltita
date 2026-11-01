import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n';
import { colors, sizes, spacing, typography } from '@/theme';

type BannerProps = {
  variant: 'offline' | 'hostAway';
};

// Display only: T-083 decides when each one shows and pauses the controls behind it.
export function Banner({ variant }: BannerProps) {
  const { strings } = useI18n();
  const offline = variant === 'offline';

  return (
    <SafeAreaView
      edges={['top']}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.banner, !offline && styles.hostAway]}
    >
      {offline ? <ActivityIndicator color={colors.text} /> : null}
      <Text style={styles.message}>{offline ? strings.offline : strings.hostAway}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  hostAway: {
    borderWidth: sizes.borderWidth,
    borderColor: colors.host,
  },
  message: {
    ...typography.bodyLg,
    flexShrink: 1,
    color: colors.text,
    textAlign: 'center',
  },
});
