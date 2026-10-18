// Palette and semantic colours (design.md §2). The only place hex values may appear.

export const palette = {
  plum900: '#2E0F35',
  plum700: '#4A1850',
  cream: '#FFF3E2',
  pink: '#FF4F8B',
  pinkDeep: '#B81F55',
  mint: '#6FDDBF',
  teal: '#1F7A6B',
  gold: '#F7B538',
  mutedOnDark: '#B9A3BE',
  mutedOnLight: '#6E5A72',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof palette;

/** Card band/face colours per card type (design.md §2.2). */
export const cardColors = {
  question: { band: palette.plum900, bandText: palette.cream, face: palette.cream },
  truth: { band: palette.teal, bandText: palette.white, face: palette.cream, accent: palette.mint },
  liar: { band: palette.pink, bandText: palette.plum900, face: palette.cream },
  challenge: { band: palette.gold, bandText: palette.plum900, face: palette.cream },
  mission: {
    band: palette.plum700,
    bandText: palette.cream,
    face: palette.cream,
    back: palette.teal,
  },
} as const;

export type CardType = keyof typeof cardColors;

/** Semantic roles (design.md §2.2). Prefer these over raw palette names in components. */
export const colors = {
  background: palette.plum900,
  surface: palette.plum700,
  surfaceLight: palette.cream,
  text: palette.cream,
  textMuted: palette.mutedOnDark,
  textOnLight: palette.plum900,
  textMutedOnLight: palette.mutedOnLight,
  accentTextOnLight: palette.pinkDeep,
  primary: palette.pink,
  onPrimary: palette.plum900,
  truth: palette.mint,
  liar: palette.pink,
  host: palette.gold,
  mask: palette.gold,
  maskGain: palette.mint,
  maskLoss: palette.pink,
  success: palette.mint,
  connected: palette.mint,
  disconnected: palette.mutedOnDark,
  destructive: palette.pink,
  /** Sticker shadow: pink on the hero card, translucent black elsewhere (design.md §4). */
  shadowHero: palette.pink,
  shadow: '#00000040',
} as const;
