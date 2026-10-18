import type { TextStyle } from 'react-native';

// Type scale (design.md §3). Font family names match the @expo-google-fonts exports loaded in T-011.

export const fonts = {
  display: 'Lalezar_400Regular',
  body: 'Cairo_400Regular',
  bodySemiBold: 'Cairo_600SemiBold',
  bodyExtraBold: 'Cairo_800ExtraBold',
} as const;

type TypeToken = Required<Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight'>> &
  Pick<TextStyle, 'letterSpacing'>;

export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 64, lineHeight: 72 },
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 48 },
  code: { fontFamily: fonts.display, fontSize: 56, lineHeight: 64, letterSpacing: 6 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 36 },
  cardMain: { fontFamily: fonts.bodyExtraBold, fontSize: 24, lineHeight: 36 },
  bodyLg: { fontFamily: fonts.bodySemiBold, fontSize: 18, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  cardSub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.bodySemiBold, fontSize: 12, lineHeight: 16 },
} as const satisfies Record<string, TypeToken>;

export type TypographyToken = keyof typeof typography;

/** Card text auto-fits from `cardMain` down to this size, then scrolls (design.md §3). */
export const cardMainMinFontSize = 18;

/** Cairo line height is never below 1.4× the font size (design.md §3). */
export const minCairoLineHeightRatio = 1.4;

/** OS font scaling is capped at 1.3× on cards (design.md §9). */
export const cardMaxFontSizeMultiplier = 1.3;
