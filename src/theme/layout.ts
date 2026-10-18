import type { ViewStyle } from 'react-native';

import { colors } from './colors';

// Spacing, radius, elevation and card proportions (design.md §4, §9).

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const screenPadding = {
  horizontal: spacing.lg,
  top: spacing.xl,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

/** The single flat "sticker" shadow, used on cards only. */
const sticker = (shadowColor: string): ViewStyle => ({
  shadowColor,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 0,
});

export const elevation = {
  card: sticker(colors.shadow),
  heroCard: sticker(colors.shadowHero),
} as const;

export const card = {
  /** Playing-card ratio 63:88 (width / height). */
  aspectRatio: 63 / 88,
  /** Card width as a share of the screen width. */
  widthRatio: 0.82,
} as const;

export const sizes = {
  minTouchTarget: 48,
  buttonHeight: 56,
  borderWidth: 2,
} as const;
