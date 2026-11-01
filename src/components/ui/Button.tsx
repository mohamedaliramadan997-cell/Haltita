import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, sizes, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'host' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Shown above the button while it is disabled (design.md §5). */
  disabledReason?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  disabledReason,
}: ButtonProps) {
  return (
    <View>
      {disabled && disabledReason ? <Text style={styles.reason}>{disabledReason}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        // shortcut: the press snaps with no haptic, T-084 animates it over 90 ms and T-085 adds the haptic.
        style={({ pressed }) => [
          styles.button,
          containerStyles[variant],
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.label, labelStyles[variant]]}>
          {variant === 'host' ? `👑 ${label}` : label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: sizes.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  disabled: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.97 }] },
  label: {
    ...typography.bodyLg,
    fontFamily: fonts.bodyExtraBold,
    textAlign: 'center',
  },
  reason: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});

const containerStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { borderWidth: sizes.borderWidth, borderColor: colors.text },
  host: { borderWidth: sizes.borderWidth, borderColor: colors.host },
  ghost: {},
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.onPrimary },
  secondary: { color: colors.text },
  host: { color: colors.host },
  ghost: { color: colors.textMuted },
});
